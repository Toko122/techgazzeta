'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/AuthProvider'

export default function RequestAccessPage() {
   const { accessToken, user, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const buildingId = searchParams.get('buildingId') 

  const [unitId, setUnitId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRequest = async () => {
    if (!buildingId) {
      setError('No building specified')
      return
    }
  
    if (!unitId) {
      setError('Please enter your unit number')
      return
    }
  
    try {
      setLoading(true)
      setError(null)
  
      const res = await fetch(
        `https://techgazzeta.org/buildings/${buildingId}/request-access`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ unitId }),
        }
      )
  
      const data = await res.json()
  
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send request')
      }
  
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send request')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Request Access to Building</h1>
      <p className="text-gray-600 mb-6">
        Please enter your unit number to request access. Building admin will approve your request.
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">Request sent successfully. Wait for approval.</p>}

      <input
        type="text"
        placeholder="Unit number"
        className="w-full p-3 mb-4 border rounded"
        value={unitId}
        onChange={(e) => setUnitId(e.target.value)}
      />

      <button
        onClick={handleRequest}
        disabled={loading}
        className="w-full bg-black text-white p-3 rounded"
      >
        {loading ? 'Sending request...' : 'Request Access'}
      </button>
    </div>
  )
}
