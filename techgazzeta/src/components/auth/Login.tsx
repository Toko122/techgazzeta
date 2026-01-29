'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { useAuth } from '@/lib/AuthProvider'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Spinner } from '../ui/spinner'

interface LoginForm {
  email: string
  password: string
}

const Login = () => {
  const router = useRouter()
  const { login } = useAuth()

  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setLoading(true)
  setError('')

  try {
    const res = await fetch('https://techgazzeta.org/iam/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Login failed')
    }

    login(data.accessToken, data.refreshToken)

    router.push('/')
  } catch (err: any) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115] px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md sm:max-w-lg bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-400">Please enter your details</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="ml-1 text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@company.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative cursor-pointer mt-6 w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-70"
          >
            <div className="flex items-center justify-center gap-2">
              {loading ? <Spinner /> : 'Sign In'}
            </div>
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          New here?{' '}
          <Link
            href="/features/auth/register"
            className="text-indigo-400 font-medium hover:text-indigo-300 transition"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
