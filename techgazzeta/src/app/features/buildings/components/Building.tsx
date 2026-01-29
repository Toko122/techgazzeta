'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthProvider'
import Link from 'next/link'
import ProtectedRoute from '@/lib/ProtectedRoute'
import {
  Building2,
  Plus,
  MapPin,
  Calendar,
  ChevronRight,
  Search,
  LayoutDashboard,
  Loader2,
  ShieldCheck
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import PageLoader from '../../../components/PageLoader'

interface Building {
  id: string
  name: string
  address: string
  createdAt: string
}

interface User {
  id: string
  role: 'super_admin' | 'manager' | 'building_admin'
  buildingId?: string
}

const BuildingsDashboard = () => {
  const { accessToken } = useAuth()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!accessToken) return

    const init = async () => {
      try {
        const userRes = await fetch('https://techgazzeta.org/iam/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      })

      if (!userRes.ok) throw new Error('Unauthorized')

        const currentUser: User = await userRes.json()
      setUser(currentUser)

        if (currentUser.role === 'building_admin') {
          setLoading(false)
          return
        }

        const buildingsRes = await fetch(
        'https://techgazzeta.org/buildings/',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: 'no-store',
        }
      )

      if (!buildingsRes.ok) {
        throw new Error('Failed to fetch buildings')
      }

      const data = await buildingsRes.json()
      setBuildings(data.buildings || [])
      } catch (err: any) {
        router.replace('/')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [accessToken, router])

  if (loading) {
    return <PageLoader />
  }

  if (user?.role === 'building_admin' && !user.buildingId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-bold">Access Restricted</h2>
          <p className="text-gray-500 mt-2">
            You are a building admin but no building is assigned to you.
          </p>
        </div>
      </div>
    )
  }

  const filteredBuildings = buildings.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-1">
                Overview
              </p>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <LayoutDashboard className="text-gray-400" size={32} />
                Buildings
              </h1>
            </div>

            {(user?.role === 'super_admin' || user?.role === 'manager') && (
              <Link
                href="/features/buildings/createBuilding"
                className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
              >
                <Plus size={20} />
                Add Building
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-4 top-5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or location..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-indigo-600 rounded-2xl p-4 flex items-center justify-between text-white shadow-lg shadow-indigo-100">
              <div className="pl-2">
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">
                  Total Assets
                </p>
                <p className="text-3xl font-black">{buildings.length}</p>
              </div>
              <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Building2 size={24} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-500 font-bold animate-pulse">
                Loading portfolio...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] text-center">
              <p className="text-red-600 font-bold">{error}</p>
            </div>
          ) : filteredBuildings.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 border border-dashed border-gray-200 text-center">
              <div className="bg-gray-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Building2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900">
                No Buildings Found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or add a new property to the list.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBuildings.map((b) => (
                <Link
                  key={b.id}
                  href={`/features/buildings/${b.id}`}
                  className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all relative overflow-hidden"
                >
                  <div className="relative z-10 space-y-6">
                    <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white">
                      <Building2 size={28} />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600">
                        {b.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <MapPin size={16} className="text-indigo-400" />
                        <p className="text-sm font-medium">{b.address}</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={14} />
                        <span className="text-xs font-bold uppercase">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default BuildingsDashboard
