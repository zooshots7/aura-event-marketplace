'use client'

import { useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [devLoading, setDevLoading] = useState(false)
  const [error, setError] = useState('')

  // Dev-only: quick login with a test account
  const handleDevLogin = async () => {
    setDevLoading(true)
    setError('')
    const devEmail = 'dev@clawsup.fun'
    const devPassword = 'devtest123'

    try {
      // Try sign in first
      await signInWithEmailAndPassword(auth, devEmail, devPassword)
      router.push('/events')
    } catch (signInErr: any) {
      // If user doesn't exist, create it
      if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, devEmail, devPassword)

          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: devEmail,
            full_name: 'Dev Tester',
          }, { merge: true })

          router.push('/events')
        } catch (signUpErr: any) {
          setError(signUpErr.message)
          setDevLoading(false)
        }
      } else {
        setError(signInErr.message)
        setDevLoading(false)
      }
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/events')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    console.log('🔵 Google Sign In clicked')
    setGoogleLoading(true)
    setError('')

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      // Upsert profile in Firestore if it's their first time
      const userRef = doc(db, 'users', result.user.uid)
      const userSnap = await getDoc(userRef)
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: result.user.email,
          full_name: result.user.displayName || 'Google User'
        })
      }

      router.push('/events')
    } catch (err: any) {
      console.error('❌ Exception:', err)
      setError(err.message || 'Unknown error')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative flex items-center justify-center px-6">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-blue-900/10" />
        <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-purple-600/15 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-blue-600/15 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000" />
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
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-bl-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 tracking-tight">Welcome back</h1>
            <p className="text-gray-400 mb-8">Sign in to access your events and content.</p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Google Sign-In */}
            <button
              onClick={handleGoogleSignIn}
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

            {/* Email/Password Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
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
                    placeholder="••••••••"
                    required
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
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Create one
              </Link>
            </p>

            {/* Dev Quick Login */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <button
                onClick={handleDevLogin}
                disabled={devLoading || loading || googleLoading}
                className="w-full py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl font-medium text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {devLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Logging in…
                  </>
                ) : (
                  '⚡ Quick Dev Login (Skip Auth)'
                )}
              </button>
              <p className="text-[11px] text-gray-600 text-center mt-2">
                Signs in as dev@clawsup.fun — for testing only
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          By signing in you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
