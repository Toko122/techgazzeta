'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthProvider'
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Hash, 
  Layers, 
  Calendar, 
  ChevronRight,
  Building2
} from 'lucide-react'

interface Unit {
  id: string
  unitNumber: string
  floor: number
  createdAt: string
}

interface User {
  id: string,
  role: 'super_admin' | 'manager'
}

export default function UnitViewPage() {
  const params = useParams()
  const buildingId = params.buildingId
  const id = params.id
  const { accessToken } = useAuth()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [unit, setUnit] = useState<Unit | null>(null)
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
  const fetchUnit = async () => {
    if (!accessToken || !buildingId || !id) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`https://techgazzeta.org/buildings/${buildingId}/units`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || data.message || 'Failed to fetch units')
      }

      const data = await res.json()

      const foundUnit = data.units.find((u: Unit) => u.id === id)

      if (!foundUnit) {
        throw new Error('Unit not found')
      }

      setUnit(foundUnit)
    } catch (err: any) {
      setError(err.message || 'Failed to load unit')
    } finally {
      setLoading(false)
    }
  }

  fetchUnit()
}, [accessToken, buildingId, id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  )

  if (error) return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-red-50 border border-red-200 rounded-2xl text-center">
      <p className="text-red-600 font-medium">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 text-sm text-red-700 underline">Try again</button>
    </div>
  )

  if (!unit) return null

  return (
    <div className="min-h-full bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/features/buildings" className="hover:text-indigo-600 transition">Buildings</Link>
            <ChevronRight size={14} />
            <Link href={`/features/buildings/${buildingId}/units`} className="hover:text-indigo-600 transition">Units</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Unit {unit.unitNumber}</span>
          </nav>
          
          <button 
            onClick={() => router.back()}
            className="flex cursor-pointer items-center cursor-pointer justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
            Back to List
          </button>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Building2 size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6">
            <div className="h-20 w-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <LayoutDashboard size={40} />
            </div>
            <div>
              <p className="text-indigo-600 font-semibold tracking-wide uppercase text-xs mb-1">Unit Details</p>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Apartment {unit.unitNumber}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

            <div className="bg-gray-50 p-6 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
              <div className="flex items-center gap-3 mb-3 text-gray-500 group-hover:text-indigo-600 transition-colors">
                <Hash size={20} />
                <span className="text-sm font-medium">Unit Number</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{unit.unitNumber}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
              <div className="flex items-center gap-3 mb-3 text-gray-500 group-hover:text-indigo-600 transition-colors">
                <Layers size={20} />
                <span className="text-sm font-medium">Floor Level</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{unit.floor} Floor</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
              <div className="flex items-center gap-3 mb-3 text-gray-500 group-hover:text-indigo-600 transition-colors">
                <Calendar size={20} />
                <span className="text-sm font-medium">Registration Date</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {new Date(unit.createdAt).toLocaleDateString('ka-GE', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}