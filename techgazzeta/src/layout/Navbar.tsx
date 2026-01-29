'use client'

import { useAuth } from '@/lib/AuthProvider'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  role: 'super_admin' | 'manager'
}

const Navbar = () => {
  const { accessToken, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (!accessToken) return null

  const role = (() => {
    try {
      return jwtDecode<DecodedToken>(accessToken).role
    } catch {
      return null
    }
  })()

  const handleLogout = () => {
    logout()
    router.push('/features/auth/login')
  }

  const navLinks = [
    { name: 'Buildings', href: '/features/buildings' },
    { name: 'Tickets', href: '/features/tickets' },
    { name: 'Notifications', href: '/features/notifications' },
    { name: 'Community', href: '/features/community' },
    { name: 'Access', href: '/access' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
      <div className="mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/features/buildings"
            className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            BMS
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => {
              if (
                link.name === 'Buildings' &&
                role !== 'super_admin' &&
                role !== 'manager'
              ) {
                return null
              }

              const active = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-all duration-300 ${
                    active
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                  )}
                </Link>
              )
            })}

            <button
              onClick={handleLogout}
              className="ml-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-red-500/20 hover:from-red-600 hover:to-pink-600 transition cursor-pointer"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white cursor-pointer"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 px-4 py-6 space-y-5">
          {navLinks.map(link => {
            if (
              link.name === 'Buildings' &&
              role !== 'super_admin' &&
              role !== 'manager'
            ) {
              return null
            }

            const active = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block text-base font-medium w-fit ${
                  active
                    ? 'text-indigo-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            )
          })}

          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 py-3 text-sm font-medium text-white cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </header>
  )
}

export default Navbar
