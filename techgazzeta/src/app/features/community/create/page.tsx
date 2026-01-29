'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '@/lib/ProtectedRoute'
import { 
  ArrowLeft, 
  Send, 
  Type, 
  AlignLeft, 
  Sparkles,
  Loader2,
  Globe,
  Bell,
  Trash2,
  AlertCircle
} from 'lucide-react'

const CreatePostPage = () => {
  const params = useParams()
  const buildingId = params?.buildingId as string
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      setError('Post upload is currently disabled. Please try again later.')
      setLoading(false)
    }, 1200)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white flex flex-col items-center p-6 md:p-12">
        
        <div className="w-full max-w-2xl flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-all duration-300"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all">
              <ArrowLeft size={18} />
            </div>
            Go Back
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-md border border-indigo-100 rounded-full shadow-sm">
            <Sparkles size={14} className="text-indigo-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              New Announcement
            </span>
          </div>
        </div>

        <div className="w-full max-w-2xl bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-indigo-100/50">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
              Create a <span className="text-indigo-600">Post</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Share important updates with your community members.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Type size={20} />
              </div>
              <input
                required
                type="text"
                placeholder="Catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white/80 border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all text-lg font-semibold text-slate-800 placeholder:text-slate-300"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-5 top-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <AlignLeft size={20} />
              </div>
              <textarea
                required
                placeholder="What's on your mind? Describe the details here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full pl-14 pr-6 py-6 bg-white/80 border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all text-base font-medium text-slate-700 placeholder:text-slate-300 resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl text-sm font-semibold">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  <Send size={20} />
                  Publish Post
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="p-2 bg-slate-100 rounded-lg"><Globe size={14} /></div>
              <p className="text-xs font-bold uppercase tracking-wide">Public Feed</p>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="p-2 bg-slate-100 rounded-lg"><Bell size={14} /></div>
              <p className="text-xs font-bold uppercase tracking-wide">Notify All</p>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="p-2 bg-slate-100 rounded-lg"><Trash2 size={14} /></div>
              <p className="text-xs font-bold uppercase tracking-wide">Removable</p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-slate-400 text-sm font-medium">
          Need help? <span className="text-indigo-500 cursor-pointer hover:underline">Contact Community Support</span>
        </p>
      </div>
    </ProtectedRoute>
  )
}

export default CreatePostPage
