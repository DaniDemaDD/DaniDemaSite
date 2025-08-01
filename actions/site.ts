"use server"

import { put } from "@vercel/blob"
import { supabase } from "@/lib/supabase"

export async function createCustomSite(formData: FormData) {
  console.log("Attempting to create custom site...")
  const username = formData.get("username") as string
  const profileImageFile = formData.get("profileImage") as File | null
  const backgroundImageFile = formData.get("backgroundImage") as File | null
  const musicFile = formData.get("musicFile") as File | null
  const musicVolume = Number.parseFloat(formData.get("musicVolume") as string)

  let profileImageUrl = ""
  let backgroundImageUrl = ""
  let musicUrl = ""

  try {
    // Check if username already exists in sites table
    const { data: existingSite, error: siteCheckError } = await supabase
      .from("sites")
      .select("id")
      .eq("username", username)
      .single()

    if (existingSite) {
      return { success: false, message: `The URL path /${username} is already taken.` }
    }

    // Upload files to Vercel Blob
    if (profileImageFile && profileImageFile.size > 0) {
      const blob = await put(`profile-images/${username}-${profileImageFile.name}`, profileImageFile, {
        access: "public",
      })
      profileImageUrl = blob.url
      console.log(`Uploaded profile image: ${profileImageUrl}`)
    }

    if (backgroundImageFile && backgroundImageFile.size > 0) {
      const blob = await put(`background-images/${username}-${backgroundImageFile.name}`, backgroundImageFile, {
        access: "public",
      })
      backgroundImageUrl = blob.url
      console.log(`Uploaded background image: ${backgroundImageUrl}`)
    }

    if (musicFile && musicFile.size > 0) {
      const blob = await put(`music/${username}-${musicFile.name}`, musicFile, { access: "public" })
      musicUrl = blob.url
      console.log(`Uploaded music: ${musicUrl}`)
    }

    // This action is now primarily for updating an *existing* site's media,
    // or for a simplified creation flow if registration is separate.
    // For now, the user and site creation is handled by registerUser in auth.ts.
    // This function will be used to update the site's media after initial creation.

    // Find the user's site by username and update it
    const { data: updatedSite, error: updateError } = await supabase
      .from("sites")
      .update({
        profile_image_url: profileImageUrl,
        background_image_url: backgroundImageUrl,
        music_url: musicUrl,
        music_volume: musicVolume,
      })
      .eq("username", username)
      .select()
      .single()

    if (updateError || !updatedSite) {
      console.error("Error updating site media:", updateError?.message)
      return { success: false, message: "Failed to update site media." }
    }

    return { success: true, message: `Site media for ${username} updated successfully!`, username: username }
  } catch (error) {
    console.error("Server error during site creation/update:", error)
    return { success: false, message: "An unexpected error occurred during site creation/update." }
  }
}

// New placeholder action for adding individual links
export async function addLinkToSite(formData: FormData) {
  console.log("Attempting to add link to site...")
  const username = formData.get("username") as string
  const linkName = formData.get("linkName") as string
  const linkUrl = formData.get("linkUrl") as string
  const iconType = formData.get("iconType") as "predefined" | "custom" // 'predefined' or 'custom'
  const customIconFile = formData.get("customIcon") as File | null // Only if iconType is 'custom'
  const predefinedIconUrl = formData.get("predefinedIconUrl") as string // Only if iconType is 'predefined'

  let iconUrl = predefinedIconUrl

  if (iconType === "custom" && customIconFile && customIconFile.size > 0) {
    const blob = await put(`link-icons/${username}-${customIconFile.name}`, customIconFile, { access: "public" })
    iconUrl = blob.url
    console.log(`Uploaded custom icon: ${iconUrl}`)
  }

  // TODO: Fetch current social_links/tool_links for the user's site
  // Append new link and update the site entry in Supabase
  console.log({
    username,
    linkName,
    linkUrl,
    iconUrl,
  })

  return { success: true, message: `Link '${linkName}' added successfully!` }
}

export async function getSiteData(username: string) {
  console.log(`Fetching data for site: ${username}`)
  try {
    // Rimosso il join con la tabella users per is_banned
    const { data: siteData, error } = await supabase
      .from("sites")
      .select("*") // Seleziona tutte le colonne dalla tabella sites
      .eq("username", username)
      .single()

    if (error || !siteData) {
      console.error("Error fetching site data:", error?.message || "Site not found")
      return null // Site not found
    }

    // Poiché non c'è più una tabella users per is_banned, assumiamo false o gestiamo diversamente
    // Se la logica di ban deve esistere, dovrà essere gestita all'interno della tabella 'sites'
    // o tramite un altro meccanismo. Per ora, is_banned sarà sempre false.
    const isBanned = false // Assumiamo che non sia bannato senza una tabella users

    return { ...siteData, is_banned: isBanned }
  } catch (error) {
    console.error("Server error fetching site data:", error)
    return null
  }
}
