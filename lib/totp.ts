// Simple TOTP implementation for 2FA
export function generateTOTP(secret: string, timeStep = 30): string {
  const time = Math.floor(Date.now() / 1000 / timeStep)

  // Convert base32 secret to bytes (simplified)
  const key = base32ToBytes(secret)

  // Generate HMAC-SHA1
  const hmac = generateHMAC(key, numberToBytes(time))

  // Extract dynamic binary code
  const offset = hmac[hmac.length - 1] & 0xf
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)

  // Return 6-digit code
  return (code % 1000000).toString().padStart(6, "0")
}

function base32ToBytes(base32: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let bits = ""

  for (const char of base32) {
    const index = alphabet.indexOf(char)
    if (index === -1) continue
    bits += index.toString(2).padStart(5, "0")
  }

  const bytes = new Uint8Array(Math.floor(bits.length / 8))
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(bits.substr(i * 8, 8), 2)
  }

  return bytes
}

function numberToBytes(num: number): Uint8Array {
  const bytes = new Uint8Array(8)
  for (let i = 7; i >= 0; i--) {
    bytes[i] = num & 0xff
    num = Math.floor(num / 256)
  }
  return bytes
}

async function generateHMAC(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-1" }, false, ["sign"])

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, data)
  return new Uint8Array(signature)
}

export function verifyTOTP(token: string, secret: string, window = 1): boolean {
  const currentTime = Math.floor(Date.now() / 1000 / 30)

  for (let i = -window; i <= window; i++) {
    const time = currentTime + i
    const expectedToken = generateTOTPForTime(secret, time)
    if (token === expectedToken) {
      return true
    }
  }

  return false
}

function generateTOTPForTime(secret: string, time: number): string {
  // Simplified TOTP generation for specific time
  const key = base32ToBytes(secret)
  const timeBytes = numberToBytes(time)

  // For demo purposes, we'll use a simplified approach
  // In production, use a proper TOTP library
  const hash = Array.from(key).reduce((acc, byte, i) => {
    return acc + byte + timeBytes[i % 8]
  }, time)

  return (hash % 1000000).toString().padStart(6, "0")
}
