'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase'

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'patient' | 'doctor'>(
    searchParams.get('role') === 'doctor' ? 'doctor' : 'patient'
  )
  const [mode, setMode] = useState<'login' | 'signup'>(
    searchParams.get('tab') === 'signup' ? 'signup' : 'login'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name, role: tab } },
        })
        if (error) throw error
        setMessage('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push(tab === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-gutter py-xl">
        <div className="w-full max-w-[480px]">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-2 p-md">
            {/* Role Tabs */}
            <div className="flex rounded-lg bg-surface-container p-[4px] mb-md">
              {(['patient', 'doctor'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-xs rounded-md text-label-sm font-medium transition-all ${
                    tab === t ? 'bg-surface-container-lowest shadow-level-1 text-on-surface' : 'text-on-surface-variant'
                  }`}
                >
                  {t === 'patient' ? 'Patient' : 'Doctor'} {mode === 'login' ? 'Login' : 'Signup'}
                </button>
              ))}
            </div>

            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-on-surface-variant text-body-md mb-md">
              {mode === 'login' ? `Sign in to your ${tab} account` : `Register as a ${tab}`}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              {mode === 'signup' && (
                <div className="flex flex-col gap-xs">
                  <label className="text-label-sm text-on-surface-variant">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="py-sm px-md bg-surface-container rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/20 text-body-md outline-none"
                  />
                </div>
              )}
              <div className="flex flex-col gap-xs">
                <label className="text-label-sm text-on-surface-variant">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="py-sm px-md bg-surface-container rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/20 text-body-md outline-none"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <div className="flex justify-between">
                  <label className="text-label-sm text-on-surface-variant">Password</label>
                  {mode === 'login' && (
                    <button type="button" className="text-label-sm text-primary hover:underline">Forgot password?</button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="py-sm px-md bg-surface-container rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/20 text-body-md outline-none"
                />
              </div>

              {error && <div className="bg-error-container text-on-error-container p-sm rounded-lg text-body-md">{error}</div>}
              {message && <div className="bg-secondary-container text-on-secondary-container p-sm rounded-lg text-body-md">{message}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-on-primary-container py-sm rounded-xl font-label-sm hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-xs"
              >
                {loading && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="relative my-md">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant"></div></div>
              <div className="relative flex justify-center"><span className="bg-surface-container-lowest px-sm text-label-sm text-on-surface-variant">or</span></div>
            </div>

            <p className="text-center text-body-md text-on-surface-variant">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-primary font-medium hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>

            {tab === 'doctor' && mode === 'signup' && (
              <p className="text-center text-body-md text-on-surface-variant mt-sm">
                Want to set up your full profile?{' '}
                <button onClick={() => router.push('/doctors/register')} className="text-primary font-medium hover:underline">
                  Doctor Registration →
                </button>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="material-symbols-outlined text-primary text-[48px] animate-spin">progress_activity</span></div>}>
      <AuthContent />
    </Suspense>
  )
}
