import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

console.log('[lufa] SUPABASE_URL:', supabaseUrl)
console.log('[lufa] ANON_KEY starts with:', supabaseAnon?.slice(0, 20))

export const supabase = createClient(supabaseUrl ?? '', supabaseAnon ?? '')
