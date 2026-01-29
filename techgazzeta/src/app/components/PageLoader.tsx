'use client'
import React from 'react'

const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-30">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-screen filter blur-[80px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] animate-pulse [animation-delay:2s]" />
        </div>
      </div>

      <div className="relative flex flex-col items-center">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-purple-400 animate-spin-slow" />
          <div className="absolute inset-[30px] rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.6)]" />
        </div>
        
        <h2 className="mt-6 text-xl font-light tracking-[0.2em] text-white/80 animate-pulse">
          LOADING
        </h2>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default FullPageLoader