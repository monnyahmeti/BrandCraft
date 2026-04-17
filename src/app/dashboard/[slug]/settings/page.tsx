'use client'

import { useTenant } from '@/lib/context/TenantContext'

export default function SettingsPage() {
  const { activeTenant } = useTenant()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      <div className="grid gap-6">
        {/* Tenant Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Workspace Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Workspace Name</label>
              <input
                type="text"
                defaultValue={activeTenant?.name || ''}
                disabled
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Workspace Slug</label>
              <input
                type="text"
                defaultValue={activeTenant?.slug || ''}
                disabled
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plan</label>
              <input
                type="text"
                defaultValue={activeTenant?.plan_type || ''}
                disabled
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 capitalize"
              />
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Members</h2>
          <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Invite Member
          </button>
          <div className="text-center text-gray-500 py-8">
            <p>No team members yet. Invite your first team member to collaborate.</p>
          </div>
        </div>

        {/* Billing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing</h2>
          <p className="text-gray-600 mb-4">
            Currently on the <span className="font-medium capitalize">{activeTenant?.plan_type}</span> plan.
          </p>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  )
}
