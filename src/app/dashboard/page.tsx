'use client'

import { useTenant } from '@/lib/context/TenantContext'

export default function DashboardPage() {
  const { activeTenant } = useTenant()

  if (!activeTenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{activeTenant.name}</h1>
        <p className="text-lg text-gray-600">
          Welcome to your brand workspace. Get started by creating brand assets or managing your projects.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Plan</h3>
          <p className="mt-2 text-2xl font-bold text-gray-900 capitalize">{activeTenant.plan_type}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Brand Assets</h3>
          <p className="mt-2 text-2xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Active Projects</h3>
          <p className="mt-2 text-2xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Get Started</h2>
        <div className="space-y-3">
          <a
            href={`/dashboard/${activeTenant.slug}/assets`}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Create Brand Assets</h3>
              <p className="text-sm text-gray-500">Colors, typography, logos, and more</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href={`/dashboard/${activeTenant.slug}/projects`}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Create Your First Project</h3>
              <p className="text-sm text-gray-500">Organize your assets and collaborate with your team</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href={`/dashboard/${activeTenant.slug}/settings`}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Configure Team Access</h3>
              <p className="text-sm text-gray-500">Invite team members and set permissions</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
