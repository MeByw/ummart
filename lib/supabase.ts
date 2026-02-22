import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://okkkxcmzkwplhzqcodro.supabase.co'
// Paste your copied Anon Key (Legacy) inside the quotes below!
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ra2t4Y216a3dwbGh6cWNvZHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzgwOTgsImV4cCI6MjA4NzE1NDA5OH0.gZVAcpQYyZTcTaNzOGT-kQkYQSzVXjLgmkcc-4-tRbg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)