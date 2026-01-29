'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/AuthProvider'
import ProtectedRoute from '@/lib/ProtectedRoute'
import { Loader2, CheckCircle2, Info } from 'lucide-react'

interface Membership {
  id: string
  buildingId: string
  unitId: string
  userId: string
  status: string
  roleInBuilding: string
  createdAt: string
  verifiedAt: string | null
}

const PendingMembershipsPage = () => {
  const { buildingId } = useParams()
  const { accessToken } = useAuth()

  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [verifyLoading, setVerifyLoading] = useState<string>('')

  useEffect(() => {
    if (!buildingId || !accessToken) return

    const fetchPending = async () => {
      setLoading(true)
      try {
        const res = await fetch(`https://techgazzeta.org/buildings/${buildingId}/memberships/pending`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || data.message || 'Failed to load pending memberships')
        }

        const data = await res.json()
        setMemberships(data.memberships || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load pending memberships')
      } finally {
        setLoading(false)
      }
    }

    fetchPending()
  }, [buildingId, accessToken])

  const handleVerify = async (membershipId: string) => {
    setVerifyLoading(membershipId)
    try {
      const res = await fetch(
        `https://techgazzeta.org/buildings/${buildingId}/memberships/${membershipId}/verify`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || data.message || 'Failed to verify membership')
      }

      setMemberships(prev => prev.filter(m => m.id !== membershipId))
    } catch (err: any) {
      setError(err.message || 'Failed to verify membership')
    } finally {
      setVerifyLoading('')
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Pending Membership Requests
          </h1>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center gap-2 text-gray-600 font-bold">
              <Loader2 className="animate-spin" />
              Loading pending requests...
            </div>
          ) : (
            <div className="space-y-4">
              {memberships.length === 0 ? (
                <div className="rounded-[2rem] bg-white border border-gray-100 p-8 text-center">
                  <Info size={24} className="mx-auto text-indigo-600" />
                  <p className="mt-4 text-gray-600 font-bold">
                    No pending membership requests.
                  </p>
                </div>
              ) : (
                memberships.map(m => (
                  <div
                    key={m.id}
                    className="bg-white rounded-[2rem] border border-gray-100 p-6 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-black text-gray-900">
                        Unit: {m.unitId}
                      </div>
                      <div className="text-gray-500 text-sm">
                        User: {m.userId}
                      </div>
                      <div className="text-gray-500 text-sm">
                        Requested: {new Date(m.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleVerify(m.id)}
                      disabled={verifyLoading === m.id}
                      className={`rounded-xl px-5 py-3 font-bold text-white transition ${
                        verifyLoading === m.id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-emerald-500 hover:bg-emerald-600"
                      }`}
                    >
                      {verifyLoading === m.id ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 />
                          Verify
                        </span>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default PendingMembershipsPage
