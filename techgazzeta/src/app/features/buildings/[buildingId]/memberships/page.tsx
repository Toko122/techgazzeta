'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import { useAuth } from '@/lib/AuthProvider'
import ProtectedRoute from '@/lib/ProtectedRoute'
import { ArrowLeft, Loader2, CheckCircle2, Info } from 'lucide-react'

interface Unit {
  id: string
  unitNumber: string
}

const MembershipRequestPage = () => {
  const { buildingId } = useParams()
  const router = useRouter()
  const { accessToken } = useAuth()

  const [units, setUnits] = useState<Unit[]>([])
  const [selectedUnit, setSelectedUnit] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
  if (!buildingId || !accessToken) return

  const fetchUnits = async () => {
    try {
      const res = await fetch(`https://techgazzeta.org/buildings/${buildingId}/units`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || data.message || 'Failed to fetch units')
      }

      const data = await res.json()
      setUnits(data.units || [])
    } catch (err: any) {
      setError('Failed to load units. Try again later.')
    }
  }

  fetchUnits()
}, [buildingId, accessToken])

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  if (!selectedUnit) {
    setError('Please select a unit')
    setLoading(false)
    return
  }

  try {
    const res = await fetch(`https://techgazzeta.org/buildings/${buildingId}/request-access`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ unitId: selectedUnit })
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || 'Failed to request access')
    }

    setSuccess(true)
    setTimeout(() => router.push(`/features/buildings/${buildingId}`), 1500)
  } catch (err: any) {
    setError(err.message || 'Failed to request access')
  } finally {
    setLoading(false)
  }
}

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6 md:p-12 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>

            <span className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600">
              Request Access
            </span>
          </div>

          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Request Access to Building
          </h1>
          <p className="text-gray-500 font-medium mb-6">
            Choose your unit and submit a membership request.
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Unit
              </label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Choose Unit --</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.unitNumber}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className={`w-full cursor-pointer rounded-xl py-3 font-bold text-white transition ${
                success
                  ? 'bg-emerald-500'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" />
                  Requesting...
                </span>
              ) : success ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 />
                  Request Sent
                </span>
              ) : (
                'Send Request'
              )}
            </button>
          </form>

          <div className="mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Info size={18} />
              <span>
                After approval, you will be able to create posts and access building features.
              </span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default MembershipRequestPage
