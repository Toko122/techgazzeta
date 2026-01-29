'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import { useAuth } from '@/lib/AuthProvider'
import ProtectedRoute from '@/lib/ProtectedRoute'
import { 
  Plus, 
  ArrowLeft, 
  Layers, 
  Trash2, 
  X, 
  CheckCircle2, 
  Building2,
  LayoutGrid,
  Loader2,
  Hash
} from 'lucide-react'

interface Unit {
  id: string
  unitNumber: string
  floor: number
  createdAt: string
}

interface NewUnit {
  unitNumber: string
  floor: number
}

export default function UnitsManagementPage() {
  const { buildingId } = useParams()
  const router = useRouter()
  const { accessToken } = useAuth()

  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  const [newUnits, setNewUnits] = useState<NewUnit[]>([
    { unitNumber: '', floor: 1 },
  ])

  const fetchUnits = async () => {
    if (!accessToken) return

    try {
      setLoading(true)
      const res = await fetch(`https://techgazzeta.org/buildings/${buildingId}/units`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || data.message || 'Failed to load units')
    }

    setUnits(data.units || [])
  } catch (err: any) {
    setError(err.message || 'Failed to load units')
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    if (accessToken) fetchUnits()
  }, [accessToken])

  const groupedByFloor = units.reduce<Record<number, Unit[]>>((acc, unit) => {
    acc[unit.floor] = acc[unit.floor] || []
    acc[unit.floor].push(unit)
    return acc
  }, {})

  const addUnitField = () => {
    setNewUnits([...newUnits, { unitNumber: '', floor: 1 }])
  }

  const removeUnitField = (index: number) => {
    if (newUnits.length > 1) {
      const updated = newUnits.filter((_, i) => i !== index)
      setNewUnits(updated)
    }
  }

  const handleUnitChange = (index: number, field: keyof NewUnit, value: string | number) => {
    const updated = [...newUnits]
    if (field === 'floor') updated[index].floor = Number(value)
    if (field === 'unitNumber') updated[index].unitNumber = value.toString()
    setNewUnits(updated)
  }

  const submitUnits = async () => {
  if (!accessToken) {
    alert('You are not authenticated')
    return
  }

  try {
    setSubmitting(true)

    const res = await fetch(`https://techgazzeta.org/buildings/${buildingId}/units`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ units: newUnits }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || data.message || 'Failed to create units')
    }

    setShowModal(false)
    setNewUnits([{ unitNumber: '', floor: 1 }])
    setUnits((prev) => [...prev, ...data.units])
  } catch (err: any) {
    alert(err.message || 'Failed to create units')
  } finally {
    setSubmitting(false)
  }
}

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
             <div className="h-20 w-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
             <Building2 className="absolute text-indigo-600" size={28} />
          </div>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs animate-pulse">Loading Directory</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f1f5f9] p-4 sm:p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-200/60">
            <div className="space-y-4">
              <button
                onClick={() => router.push(`/features/buildings/${buildingId}/units`)}
                className="group cursor-pointer flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Building
              </button>
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  Units <span className="text-indigo-600">Inventory</span>
                </h1>
                <p className="text-slate-500 font-medium">Manage and organize all available units in this building.</p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Plus size={20} />
              Register New Units
            </button>
          </div>

          {Object.keys(groupedByFloor).length === 0 ? (
            <div className="bg-white rounded-[3rem] p-12 sm:p-24 border-2 border-dashed border-slate-200 text-center space-y-6 shadow-sm">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-slate-300 ring-8 ring-slate-50/50">
                <LayoutGrid size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800">No Units Registered</h3>
                <p className="text-slate-500 max-w-sm mx-auto font-medium">This building is currently empty. Start by adding floor and unit details.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-20">
              {Object.entries(groupedByFloor)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([floor, floorUnits]) => (
                <div key={floor} className="relative">

                  <div className="sticky top-6 z-20 flex items-center gap-4 mb-10">
                    <div className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-2xl shadow-xl shadow-slate-200 ring-4 ring-white">
                      <Layers size={18} className="text-indigo-400" />
                      <span className="text-sm font-black uppercase tracking-[0.2em]">Floor {floor}</span>
                    </div>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-300 to-transparent"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {floorUnits.map(unit => (
                      <div
                        key={unit.id}
                        className="group relative bg-white rounded-[2rem] p-7 border border-slate-200/60 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                      >
                        <div className="flex items-start justify-between mb-8">
                          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                            <LayoutGrid size={24} />
                          </div>
                          <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
                            ID-{unit.id.slice(-4)}
                          </span>
                        </div>

                        <div className="space-y-1">
                            <h4 className="text-3xl font-black text-slate-900 tracking-tight">Unit {unit.unitNumber}</h4>
                            <div className="flex items-center gap-2 text-slate-400">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <p className="text-[10px] font-bold uppercase tracking-widest">Active System</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-5 border-t border-slate-100 flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-500 uppercase">Registered</span>
                          <span className="text-[11px] font-bold text-slate-500">{new Date(unit.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

           {showModal && (
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

              <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xl shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in duration-200">

                <div className="flex justify-between items-center relative z-10">

                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Configure Units</h2>

                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                    <X size={24} />
                  </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">

                  {newUnits.map((unit, index) => (

                    <div key={index} className="flex items-center gap-3 animate-in slide-in-from-right duration-300">

                      <div className="flex-1 bg-gray-50 rounded-2xl p-2 flex items-center gap-2 border border-transparent focus-within:border-indigo-100 focus-within:bg-white transition-all">

                         <div className="pl-3 text-gray-400"><LayoutGrid size={18} /></div>

                         <input
                          type="number"
                          placeholder="Unit #"
                          required
                          min={0}
                          value={unit.unitNumber}
                          onChange={e => handleUnitChange(index, 'unitNumber', e.target.value)}
                          className="w-full bg-transparent p-2 outline-none font-bold text-gray-800"

                        />
                      </div>
                      <div className="w-24 bg-gray-50 rounded-2xl p-2 border border-transparent focus-within:border-indigo-100 focus-within:bg-white transition-all">

                        <input
                          type="number"
                          placeholder="Floor"
                          min={0}
                          required
                          value={unit.floor}
                          onChange={e => handleUnitChange(index, 'floor', e.target.value)}
                          className="w-full bg-transparent p-2 outline-none text-center font-bold text-indigo-600"

                        />
                      </div>

                      {newUnits.length > 1 && (
                        <button onClick={() => removeUnitField(index)} className="p-3 cursor-pointer text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={addUnitField}
                    className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-bold flex items-center justify-center gap-3 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group cursor-pointer"
                  >
                    <div className="p-1 bg-slate-100 rounded-lg group-hover:bg-indigo-100 transition-colors">
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    </div>
                    Add Another Entry
                  </button>
                </div>

                <div className="p-8 sm:p-10 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-4 rounded-2xl font-bold text-slate-500 hover:bg-white hover:text-slate-700 transition-all cursor-pointer order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitUnits}
                    disabled={submitting}
                    className="flex-[2] bg-slate-900 text-white px-4 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer order-1 sm:order-2"
                  >
                    {submitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                    {submitting ? 'Creating Units...' : 'Register All Units'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}