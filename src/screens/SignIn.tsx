import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  onDemoSignIn: () => void
}

export default function SignIn({ onDemoSignIn }: Props) {
  const [email,     setEmail]     = useState('')
  const [sent,      setSent]      = useState(false)
  const [code,      setCode]      = useState('')
  const [loading,   setLoading]   = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [err,       setErr]       = useState<string | null>(null)

  async function handleSend() {
    if (!email.trim()) return
    setLoading(true)
    setErr(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) setErr(error.message)
    else setSent(true)
    setLoading(false)
  }

  async function handleVerify() {
    if (!code.trim()) return
    setVerifying(true)
    setErr(null)
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    })
    if (error) setErr(error.message)
    setVerifying(false)
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ padding: '80px 28px 40px' }}
    >
      <div className="flex items-baseline gap-2">
        <span
          className="font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--mute)' }}
        >
          No. 001 · Private Edition · V0.1
        </span>
      </div>

      <h1
        className="font-serif"
        style={{ fontSize: 64, lineHeight: 0.95, margin: '32px 0 8px', letterSpacing: '-0.02em', color: 'var(--ink)' }}
      >
        Lu<span style={{ fontStyle: 'italic', color: 'var(--luca)' }}>&amp;</span>Fa
      </h1>

      <p
        className="font-serif italic"
        style={{ fontSize: 22, color: 'var(--mute)', margin: '0 0 auto', lineHeight: 1.25 }}
      >
        A small private journal of <br />
        things-we-want-to-do, together.
      </p>

      {!sent ? (
        <div className="flex flex-col gap-4">
          <div className="rule" />
          <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--mute)' }}>
            Your email
          </span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="you@example.com"
            className="font-serif w-full"
            style={{
              background: 'transparent', border: 0, outline: 0,
              fontSize: 28, color: 'var(--ink)', padding: '4px 0',
              letterSpacing: '-0.01em',
            }}
          />
          <div className="rule" />
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex items-center justify-center h-12 rounded-pill font-sans font-medium text-[15px] transition-opacity active:scale-[0.97]"
            style={{ background: 'var(--ink)', color: 'var(--paper)', letterSpacing: '-0.01em', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Sending…' : 'Send me a code →'}
          </button>
          {err && (
            <p className="font-sans text-sm text-center" style={{ color: 'var(--warn)', marginTop: 4 }}>
              {err}
            </p>
          )}
          <p className="font-mono uppercase text-center" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--mute)', marginTop: 8 }}>
            Closed system · Two readers only
          </p>
          <button
            onClick={onDemoSignIn}
            className="font-serif italic text-center"
            style={{ fontSize: 14, color: 'var(--mute)', marginTop: 4 }}
          >
            (Demo) skip sign-in →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4" style={{ animation: 'fadeIn .3s' }}>
          <div className="rule" />
          <p className="font-serif italic" style={{ fontSize: 22, color: 'var(--ink)', lineHeight: 1.3 }}>
            Sent. Enter the code<br />
            from your email —
          </p>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
            placeholder="123456"
            maxLength={6}
            className="font-mono w-full"
            style={{
              background: 'transparent', border: 0, outline: 0,
              fontSize: 40, color: 'var(--ink)', padding: '4px 0',
              letterSpacing: '0.2em',
            }}
          />
          <div className="rule" />
          <button
            onClick={handleVerify}
            disabled={verifying || code.length < 6}
            className="flex items-center justify-center h-12 rounded-pill font-sans font-medium text-[15px] transition-opacity active:scale-[0.97]"
            style={{ background: 'var(--ink)', color: 'var(--paper)', letterSpacing: '-0.01em', opacity: (verifying || code.length < 6) ? 0.4 : 1 }}
          >
            {verifying ? 'Signing in…' : 'Sign in →'}
          </button>
          {err && (
            <p className="font-sans text-sm text-center" style={{ color: 'var(--warn)', marginTop: 4 }}>
              {err}
            </p>
          )}
          <button
            onClick={() => { setSent(false); setCode(''); setErr(null) }}
            className="font-serif italic text-center"
            style={{ fontSize: 14, color: 'var(--mute)', marginTop: 4 }}
          >
            ← use a different email
          </button>
        </div>
      )}
    </div>
  )
}
