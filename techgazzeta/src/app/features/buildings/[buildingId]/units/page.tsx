'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from '@/lib/axios'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthProvider'
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  ChevronRight, 
  Building2, 
  Eye,
  Layers,
  Home
} from 'lucide-react'

interface Unit {
  id: string
  unitNumber: string
  floor: number
  createdAt: string
}

export default function UnitsPage() {
  const { buildingId } = useParams()
  const { accessToken } = useAuth()

  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
  const fetchUnits = async () => {
    if (!accessToken || !buildingId) return

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
      setUnits(data.units || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load units')
    } finally {
      setLoading(false)
    }
  }

  fetchUnits()
}, [buildingId, accessToken])

  const filteredUnits = units.filter(u => {
    const matchesFloor = floorFilter === 'all' || u.floor === floorFilter
    const matchesSearch = u.unitNumber.toLowerCase().includes(search.toLowerCase())
    return matchesFloor && matchesSearch
  })

  const floors = Array.from(new Set(units.map(u => u.floor))).sort((a, b) => a - b)

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <Link href="/features/buildings" className="hover:text-indigo-600 transition">Buildings</Link>
              <ChevronRight size={14} />
              <span className="text-gray-900 font-medium tracking-tight">Units Management</span>
            </nav>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Building2 className="text-indigo-600" size={32} />
              Units List
            </h1>
          </div>

          <Link
            href={`/features/buildings/${buildingId}/createUnit`}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Plus size={20} />
            Add New Unit
          </Link>
        </div>

        <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by unit number..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-gray-700"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-transparent focus-within:border-indigo-100 transition-all">
            <Filter size={18} className="text-gray-400" />
            <select
              className="bg-transparent border-none outline-none text-gray-700 font-medium cursor-pointer min-w-[120px]"
              value={floorFilter}
              onChange={e => setFloorFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            >
              <option value="all">All Floors</option>
              {floors.map(f => (
                <option key={f} value={f}>Floor {f}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="text-gray-500 font-medium">Fetching units...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 p-12 rounded-[2rem] text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-500 font-medium text-lg">No units found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUnits.map(unit => (
              <div
                key={unit.id}
                className="group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <LayoutGrid size={24} />
                  </div>
                  <span className="bg-gray-50 text-gray-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    ID: {unit.id.slice(0, 5)}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    Apartment {unit.unitNumber}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <Layers size={14} />
                    <span>Floor {unit.floor}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold leading-tight">
                    Created<br />
                    <span className="text-gray-600">
                      {new Date(unit.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <Link
                    href={`/features/buildings/${buildingId}/units/${unit.id}`}
                    className="inline-flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all group/btn shadow-sm"
                  >
                    <Eye size={16} />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}