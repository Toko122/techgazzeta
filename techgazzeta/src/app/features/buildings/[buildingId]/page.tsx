'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthProvider'
import ProtectedRoute from '@/lib/ProtectedRoute'
import Link from 'next/link'
import {
  Building2,
  MapPin,
  Calendar,
  ArrowLeft,
  LayoutGrid,
  ChevronRight,
  Loader2,
  Info
} from 'lucide-react'

interface Building {
  id: string
  name: string
  address: string
  createdAt: string
}

interface User {
  id: string
  role: 'super_admin' | 'manager'
}

const BuildingPage = () => {
  const { buildingId } = useParams<{ buildingId: string }>()
  const router = useRouter()
  const { accessToken } = useAuth()

  const [building, setBuilding] = useState<Building | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
  if (!accessToken) return

  const fetchUser = async () => {
    try {
      const res = await fetch('https://techgazzeta.org/iam/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      })

      if (!res.ok) {
        throw new Error('Failed to fetch user info')
      }

      const data = await res.json()
      setUser(data.user)
    } catch (err) {
      console.error('getMe error', err)
      router.replace('/')
    }
  }

  fetchUser()
}, [accessToken, router])

  useEffect(() => {
    if (!user) return

    if (user.role !== 'super_admin' && user.role !== 'manager') {
      router.replace('/')
    }
  }, [user, router])

  useEffect(() => {
    if (!accessToken || !buildingId) return

    const fetchBuilding = async () => {
  if (!accessToken || !buildingId) return

  setLoading(true)
  setError('')
  try {
    const res = await fetch(`https://techgazzeta.org/buildings/${buildingId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || 'Failed to fetch building')
    }

    const data = await res.json()
    setBuilding(data)
  } catch (err: any) {
    setError(err.message || 'Failed to fetch building')
  } finally {
    setLoading(false)
  }
}

    fetchBuilding()
  }, [accessToken, buildingId])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-bold animate-pulse tracking-tight">
          Loading property details...
        </p>
      </div>
    )
  }

  if (error || !building) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-red-50 text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Info size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            {error || 'Building not found'}
          </h2>
          <button
            onClick={() => router.push('/features/buildings')}
            className="mt-6 text-indigo-600 font-black hover:text-indigo-700 transition flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto space-y-12">

          <div className="flex md:flex-row flex-col gap-4 items-center justify-between">
            <button
              onClick={() => router.push('/features/buildings')}
              className="group cursor-pointer flex items-center gap-4 text-sm font-black text-gray-500 hover:text-indigo-600"
            >
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:bg-indigo-600 group-hover:text-white">
                <ArrowLeft size={18} />
              </div>
              BACK TO DASHBOARD
            </button>

            <div className="flex gap-3">
              <Link
                href={`/features/buildings/${buildingId}/memberships`}
                className="bg-gray-200 text-gray-800 py-1.5 px-6 rounded-[20px] hover:bg-gray-300"
              >
                Membership
              </Link>

              <Link
                href={`/features/community/buildings/${buildingId}/posts`}
                className="bg-indigo-600 py-1.5 px-6 text-white rounded-[20px] hover:bg-indigo-700"
              >
                Posts
              </Link>
            </div>
          </div>

          <div className="relative bg-white rounded-[3.5rem] shadow border border-gray-100 overflow-hidden">
            <div className="p-10 md:p-16 flex flex-col md:flex-row gap-12">
              <div className="h-32 w-32 md:h-44 md:w-44 bg-indigo-600 rounded-[3rem] flex items-center justify-center text-white">
                <Building2 size={72} />
              </div>

              <div className="flex-1 space-y-6">
                <h1 className="text-4xl md:text-7xl font-black text-gray-900">
                  {building.name}
                </h1>

                <div className="flex items-center gap-8 text-gray-500 font-bold">
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-indigo-500" />
                    {building.address}
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-indigo-500" />
                    {new Date(building.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link
              href={`/features/buildings/${buildingId}/units`}
              className="group bg-white p-10 rounded-[3rem] border border-gray-100 hover:shadow-xl transition col-span-1 md:col-span-2"
            >
              <div className="space-y-8">
                <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center">
                  <LayoutGrid size={32} />
                </div>

                <h3 className="text-3xl font-black text-gray-900">
                  Units & Apartments
                </h3>

                <div className="flex items-center gap-2 text-indigo-600 font-black text-sm uppercase">
                  Enter Module <ChevronRight size={20} />
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  )
}

export default BuildingPage
