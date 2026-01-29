'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Spinner } from '../ui/spinner'

type Role =
  | 'resident'
  | 'building_admin'
  | 'manager'
  | 'provider'
  | 'super_admin'

interface RegisterForm {
  email: string
  password: string
  role: Role
}

const ROLES: { label: string; value: Role }[] = [
  { label: 'Resident', value: 'resident' },
  { label: 'Building Admin', value: 'building_admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Provider', value: 'provider' },
  { label: 'Super Admin', value: 'super_admin' },
]

export default function Register() {
  const router = useRouter()

  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    role: 'resident',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

     try {
    const res = await fetch('https://techgazzeta.org/iam/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        role: form.role,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Registration failed')
    }

     router.push('/features/auth/login')
    
  } catch (error: any) {
    console.error('REGISTER ERROR:', error.message)
  } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Create Account
        </h1>
        <p className="mt-1 mb-6 text-sm sm:text-base text-gray-500">
          Register to access the platform
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {ROLES.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 cursor-pointer w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner /> Loading
              </div>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/features/auth/login"
            className="text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
