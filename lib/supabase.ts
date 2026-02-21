import { createClient } from '@supabase/supabase-js'

// Temporarily pasting them directly here to test!
const supabaseUrl = 'https://okkkxcmzkwplhzqcodro.supabase.co'
const supabaseAnonKey = 'sb_publishable_-iFwZ7VW2yKFjAV-i_uQag_PewTTYjX'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)