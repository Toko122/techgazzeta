'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/AuthProvider'
import { useRouter } from 'next/navigation'
import { Loader2, Building2, MapPin, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import ProtectedRoute from '@/lib/ProtectedRoute'

export default function CreateBuildingPage() {
  const { accessToken } = useAuth()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (!accessToken) {
      setError('You are not authenticated')
      setLoading(false)
      router.push('/features/auth/login')
      return
    }

    try {
      const res = await fetch(`https://techgazzeta.org/buildings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, address }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create building')
      }

      setSuccess(true)
      setName('')
      setAddress('')

      setTimeout(() => {
        router.push('/features/buildings')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to create building')
    } finally {
      setLoading(false)
    }
  }


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        
        <div className="w-full max-w-xl mb-8">
          <button 
            onClick={() => router.back()}
            className="group cursor-pointer flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <div className="p-2 cursor-pointer bg-white rounded-xl shadow-sm group-hover:bg-indigo-50 transition-colors border border-gray-100">
              <ArrowLeft size={18} />
            </div>
            Back to List
          </button>
        </div>

        <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-500">
          
          <div className="bg-indigo-600 p-10 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-2">
                <Building2 size={32} />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Add New Building</h1>
              <p className="text-indigo-100 font-medium opacity-80">Register a new property in your portfolio</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl animate-shake">
                <AlertCircle size={20} />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl">
                <CheckCircle2 size={20} />
                <p className="text-sm font-bold">Building created successfully!</p>
              </div>
            )}

            <div className="space-y-6">

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                  Building Name
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-600 transition-colors">
                    <Building2 size={20} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Grand Plaza Tower"
                    className="w-full text-black placeholder:text-gray-400 pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-semibold placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                  Physical Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <MapPin size={20} />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="123 Luxury Ave, Tbilisi"
                    className="w-full pl-12 pr-4 placeholder:text-gray-400 py-4 bg-gray-50 border border-gray-300 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gray-900 text-white cursor-pointer py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-600 transition-all duration-300 disabled:opacity-50 active:scale-[0.98] shadow-xl shadow-gray-200 hover:shadow-indigo-200"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  'Confirm & Create'
                )}
              </div>
            </button>
          </form>
        </div>

        <p className="mt-8 text-gray-400 text-sm font-medium">
          Need help? <span className="text-indigo-600 cursor-pointer hover:underline">Contact System Administrator</span>
        </p>
      </div>
    </ProtectedRoute>
  )
}