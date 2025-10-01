import { createClient } from "@supabase/supabase-js"

if (!process.env.SUPABASE_URL) {
  throw new Error("Missing env.SUPABASE_URL")
}
if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error("Missing env.SUPABASE_ANON_KEY")
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

// Export createClient for use in other files if needed
export { createClient }
