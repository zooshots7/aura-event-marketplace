'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2, Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const passwordStrength = (() => {
    if (password.length === 0) return { level: 0, label: '' }
    if (password.length < 6) return { level: 1, label: 'Too short' }
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)
    const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length
    if (password.length >= 8 && score >= 3) return { level: 3, label: 'Strong' }
    if (password.length >= 6 && score >= 2) return { level: 2, label: 'Medium' }
    return { level: 1, label: 'Weak' }
  })()

  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500']
  const strengthTextColors = ['', 'text-red-400', 'text-yellow-400', 'text-green-400']

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Create profile
      await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
        },
      ])

      // If email confirmation is required, show success message
      if (data.user.identities?.length === 0 || data.session === null) {
        setSuccess(true)
        setLoading(false)
      } else {
        router.push('/events')
      }
    }
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative flex items-center justify-center px-6 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-purple-900/10" />
        <div className="absolute top-[-15%] right-[-15%] w-[50%] h-[50%] bg-blue-600/15 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
        <div className="absolute bottom-[-15%] left-[-15%] w-[50%] h-[50%] bg-pink-600/15 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <Sparkles className="w-7 h-7 text-purple-400" />
          <span className="text-4xl font-extrabold tracking-tighter bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            AURA
          </span>
        </Link>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-tr-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            {/* Success State */}
            {success ? (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Check your email</h2>
                <p className="text-gray-400 mb-6">
                  We&apos;ve sent a confirmation link to{' '}
                  <span className="text-white font-medium">{email}</span>. Click it to activate your account.
                </p>
                <Link
                  href="/auth/signin"
                  className="inline-flex py-3 px-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition"
                >
                  Go to Sign In
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-black mb-2 tracking-tight">Create your account</h1>
                <p className="text-gray-400 mb-8">Start uploading and earning in minutes.</p>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Google Sign-Up */}
                <button
                  onClick={handleGoogleSignUp}
                  disabled={googleLoading || loading}
                  className="w-full py-4 bg-white/[0.07] border border-white/10 rounded-xl font-semibold hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-6 group"
                >
                  {googleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  <span className="text-gray-200 group-hover:text-white transition-colors">
                    {googleLoading ? 'Redirecting…' : 'Continue with Google'}
                  </span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Form */}
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      <User className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition text-white placeholder:text-gray-600 text-base"
                      placeholder="John Doe"
                      required
                      disabled={loading || googleLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      <Mail className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition text-white placeholder:text-gray-600 text-base"
                      placeholder="you@example.com"
                      required
                      disabled={loading || googleLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      <Lock className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition text-white placeholder:text-gray-600 text-base pr-12"
                        placeholder="Min. 6 characters"
                        required
                        minLength={6}
                        disabled={loading || googleLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Password strength meter */}
                    {password.length > 0 && (
                      <div className="mt-2">
                        <div className="flex gap-1.5 mb-1">
                          {[1, 2, 3].map(i => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength.level ? strengthColors[passwordStrength.level] : 'bg-white/10'
                                }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs ${strengthTextColors[passwordStrength.level]}`}>
                          {passwordStrength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || googleLoading || passwordStrength.level < 1}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating account…
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
