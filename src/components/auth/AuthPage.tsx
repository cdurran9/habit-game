import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sword } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [signupDone, setSignupDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setSignupDone(true)
    }

    setLoading(false)
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30'

  if (signupDone) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-white text-xl font-bold mb-2">Check your email</h2>
          <p className="text-white/50 text-sm">
            We sent a confirmation link to <span className="text-white/80">{email}</span>.
            Click it to activate your account, then come back and log in.
          </p>
          <button
            className="mt-6 text-white/40 text-sm hover:text-white/70 transition-colors"
            onClick={() => { setSignupDone(false); setMode('login') }}
          >
            Back to login
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Sword size={48} weight="duotone" color="rgba(255,255,255,0.8)" className="mx-auto mb-3" />
          <h1 className="text-white text-2xl font-bold">Habit Quest</h1>
          <p className="text-white/40 text-sm mt-1">Level up your life</p>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex rounded-lg bg-white/5 p-1 mb-6">
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null) }}
                className="flex-1 py-1.5 rounded-md text-sm font-medium transition-colors capitalize"
                style={{
                  backgroundColor: mode === m ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: mode === m ? 'white' : 'rgba(255,255,255,0.4)',
                }}
              >
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-white/50 text-xs font-semibold uppercase tracking-wide mb-1.5">Email</label>
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-white/50 text-xs font-semibold uppercase tracking-wide mb-1.5">Password</label>
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              {mode === 'signup' && (
                <p className="text-white/30 text-xs mt-1">Minimum 6 characters</p>
              )}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-1"
            >
              {loading ? '...' : mode === 'login' ? 'Log In' : 'Create Account'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
