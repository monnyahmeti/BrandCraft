'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function OnboardingPage() {
  const router = useRouter()
  const [brandName, setBrandName] = useState('')
  const [brandSlug, setBrandSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-generate slug from brand name
  const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setBrandName(name)

    // Auto-generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setBrandSlug(slug)
  }

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!brandName || !brandSlug) {
      setError('Brand name and slug are required')
      setLoading(false)
      return
    }

    try {
      const { createTenant } = await import('@/app/actions/tenant')
      const result = await createTenant({
        name: brandName,
        slug: brandSlug,
      })

      // Redirect to dashboard with the new tenant
      router.push(`/dashboard/${result.tenantSlug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create brand')
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to BrandCraft
          </h1>
          <p className="text-lg text-gray-600">
            Let's set up your first brand workspace
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleCreateBrand} className="space-y-6">
            <div>
              <label htmlFor="brand-name" className="block text-sm font-medium text-gray-700">
                Brand Name
              </label>
              <input
                id="brand-name"
                type="text"
                placeholder="Enter your brand name"
                value={brandName}
                onChange={handleBrandNameChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-2 text-sm text-gray-500">
                Slug: <span className="font-mono text-gray-700">{brandSlug || 'auto-generated'}</span>
              </p>
            </div>

            <div>
              <label htmlFor="brand-description" className="block text-sm font-medium text-gray-700">
                Brand Description
              </label>
              <textarea
                id="brand-description"
                placeholder="Describe your brand..."
                rows={4}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating Brand...' : 'Create Brand'}
            </button>
          </form>

          <button
            onClick={handleSignOut}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
