// Service Worker for data persistence
const CACHE_NAME = "ai-business-site-cache-v1"
const DYNAMIC_CACHE = "ai-business-site-dynamic-v1"

// Assets to cache on install
const STATIC_ASSETS = ["/", "/favicon.ico", "/manifest.json", "/placeholder.svg"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  // Activate immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE).map((name) => caches.delete(name)),
      )
    }),
  )
  // Take control of all clients
  return self.clients.claim()
})

// Helper function to determine if a request is an API call
const isApiRequest = (url) => {
  return url.pathname.startsWith("/api/")
}

// Helper function to determine if a request is for a static asset
const isStaticAsset = (url) => {
  return (
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".woff2")
  )
}

// Fetch event - network first for API, cache first for static assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return
  }

  // Handle API requests - network first, then cache
  if (isApiRequest(url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to store in cache
          const responseToCache = response.clone()

          // Only cache successful responses
          if (response.ok) {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }

          return response
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(event.request)
        }),
    )
    return
  }

  // Handle static assets - cache first, then network
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response
          return cachedResponse
        }

        // If not in cache, fetch from network
        return fetch(event.request).then((response) => {
          // Clone the response to store in cache
          const responseToCache = response.clone()

          // Only cache successful responses
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }

          return response
        })
      }),
    )
    return
  }

  // For HTML pages - network first, then cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response to store in cache
        const responseToCache = response.clone()

        // Only cache successful responses
        if (response.ok) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }

        return response
      })
      .catch(() => {
        // If network fails, try to get from cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          // If not in cache, try to get the index page
          if (event.request.mode === "navigate") {
            return caches.match("/")
          }

          return new Response("Network error", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          })
        })
      }),
  )
})

// Background sync for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-backups") {
    event.waitUntil(syncBackups())
  }
})

// Function to sync backups when online
async function syncBackups() {
  try {
    // Get all pending backups from IndexedDB
    const pendingBackups = await getPendingBackups()

    // Send each backup to the server
    for (const backup of pendingBackups) {
      await fetch("/api/admin/backup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backup),
      })

      // Remove from pending after successful sync
      await removePendingBackup(backup.id)
    }

    // Notify clients that sync is complete
    const clients = await self.clients.matchAll()
    clients.forEach((client) => {
      client.postMessage({
        type: "SYNC_COMPLETE",
        message: "All backups have been synced",
      })
    })
  } catch (error) {
    console.error("Error syncing backups:", error)
  }
}

// These functions would use IndexedDB in a real implementation
async function getPendingBackups() {
  return []
}

async function removePendingBackup(id) {
  // Implementation would use IndexedDB
}

// Listen for messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
