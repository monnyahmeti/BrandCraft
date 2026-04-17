'use client'

export default function AssetsPage() {

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Brand Assets</h1>

      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
        Add Asset
      </button>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <svg className="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6h6m0 0v6" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No brand assets yet</h3>
        <p className="text-gray-500 mb-4">
          Create your first brand asset by clicking the "Add Asset" button above.
        </p>
      </div>
    </div>
  )
}
