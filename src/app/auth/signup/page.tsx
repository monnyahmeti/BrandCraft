'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Lock, Mail, Shield } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackError = searchParams.get('error')
  const callbackErrorMessage =
    callbackError === 'oauth_callback_failed'
      ? 'Google sign-up could not be completed. Please try again.'
      : callbackError === 'missing_code'
        ? 'The authentication callback was missing required data.'
        : null

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    setError(null)

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError

      // Redirect to onboarding after successful signup
      router.push('/onboarding')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setEmailLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError(null)

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError
    } catch (err) {
      setGoogleLoading(false)
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[26rem] w-[26rem] rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8">
          <p className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
            <Shield className="h-4 w-4" />
            BrandCraft Secure Access
          </p>
          <h2 className="text-center text-3xl font-extrabold text-white">Create your account</h2>
          <p className="mt-2 text-center text-sm text-slate-200">
            Start managing your brand identity.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          {(error || callbackErrorMessage) && (
            <div className="rounded-md border border-red-300/60 bg-red-100 p-3">
              <p className="text-sm font-medium text-red-900">{error || callbackErrorMessage}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-white">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-black placeholder:text-slate-500 focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-white">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-black placeholder:text-slate-500 focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || emailLoading}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {googleLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-900" />
                Continuing with Google...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M21.35 11.1H12v2.98h5.39c-.23 1.48-1.78 4.34-5.39 4.34-3.24 0-5.88-2.68-5.88-5.99 0-3.3 2.64-5.99 5.88-5.99 1.85 0 3.1.79 3.81 1.47l2.6-2.52C16.87 3.95 14.68 3 12 3 6.98 3 3 7.02 3 12.03c0 5.01 3.98 9.03 9 9.03 5.2 0 8.65-3.65 8.65-8.8 0-.59-.06-1.03-.15-1.46Z"
                    fill="#111827"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/25" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 font-semibold tracking-wider text-slate-200">or</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={emailLoading || googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-cyan-300/60 bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {emailLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                Creating account...
              </>
            ) : (
              'Sign up with email'
            )}
          </button>

          <p className="text-center text-sm text-slate-100">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-semibold text-cyan-200 hover:text-cyan-100">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
