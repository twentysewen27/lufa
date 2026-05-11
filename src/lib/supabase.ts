import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

console.log('[lufa] SUPABASE_URL:', supabaseUrl)
console.log('[lufa] ANON_KEY starts with:', supabaseAnon?.slice(0, 20))

// Cookies are shared between the browser and the iOS PWA homescreen context (unlike
// localStorage which is isolated per context). This lets a magic link clicked in Safari
// establish a session that is immediately visible when the user switches to the PWA.
const CHUNK = 3800
const secure = location.protocol === 'https:' ? '; Secure' : ''
const cookieOpts = `; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax${secure}`

function getCookie(name: string): string | null {
  const m = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)')
  )
  return m ? decodeURIComponent(m[1]) : null
}

function delCookie(name: string) {
  document.cookie = `${name}=; max-age=0; path=/; SameSite=Lax`
}

const cookieStorage = {
  getItem(key: string): string | null {
    const c0 = getCookie(`${key}__0`)
    if (c0 !== null) {
      let val = c0
      for (let i = 1; ; i++) {
        const ci = getCookie(`${key}__${i}`)
        if (ci === null) break
        val += ci
      }
      return val
    }
    return getCookie(key)
  },
  setItem(key: string, value: string): void {
    delCookie(key)
    for (let i = 0; getCookie(`${key}__${i}`) !== null; i++) delCookie(`${key}__${i}`)
    if (value.length <= CHUNK) {
      document.cookie = `${key}=${encodeURIComponent(value)}${cookieOpts}`
    } else {
      for (let i = 0; i * CHUNK < value.length; i++) {
        document.cookie = `${key}__${i}=${encodeURIComponent(value.slice(i * CHUNK, (i + 1) * CHUNK))}${cookieOpts}`
      }
    }
  },
  removeItem(key: string): void {
    delCookie(key)
    for (let i = 0; getCookie(`${key}__${i}`) !== null; i++) delCookie(`${key}__${i}`)
  },
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnon ?? '', {
  auth: {
    // Implicit flow: token arrives in the URL hash — no code_verifier required.
    // This prevents the PKCE mismatch that occurs when the magic link opens in a
    // different browser context than the one that requested it (PWA → Safari).
    flowType: 'implicit',
    storage: cookieStorage,
    detectSessionInUrl: true,
    persistSession: true,
  },
})
