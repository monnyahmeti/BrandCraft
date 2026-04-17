'use client'

import { useTenant } from '@/lib/context/TenantContext'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { activeTenant, tenants, switchTenant } = useTenant()
  const router = useRouter()
  const [showTenantMenu, setShowTenantMenu] = useState(false)

  const handleSignOut = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!activeTenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Home */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                BrandCraft
              </Link>
            </div>

            {/* Tenant Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTenantMenu(!showTenantMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <span className="font-medium text-gray-900">{activeTenant.name}</span>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {showTenantMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                  {tenants.map((tenant) => (
                    <button
                      key={tenant.id}
                      onClick={() => {
                        switchTenant(tenant.id)
                        setShowTenantMenu(false)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        activeTenant.id === tenant.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {tenant.name}
                    </button>
                  ))}
                  <div className="border-t border-gray-200 mt-1">
                    <Link
                      href="/onboarding"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                    >
                      + Create New Brand
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <nav className="p-6 space-y-2">
            <Link
              href={`/dashboard/${activeTenant.slug}`}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Dashboard
            </Link>
            <Link
              href={`/dashboard/${activeTenant.slug}/assets`}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Brand Assets
            </Link>
            <Link
              href={`/dashboard/${activeTenant.slug}/projects`}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Projects
            </Link>
            <Link
              href={`/dashboard/${activeTenant.slug}/settings`}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
