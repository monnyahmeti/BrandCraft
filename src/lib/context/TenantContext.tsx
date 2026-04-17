'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

export interface Tenant {
  id: string
  name: string
  slug: string
  plan_type: string
  created_at: string
}

interface TenantContextType {
  activeTenant: Tenant | null
  tenants: Tenant[]
  setActiveTenant: (tenant: Tenant) => void
  switchTenant: (tenantId: string) => void
  isLoading: boolean
  refetchTenants: () => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refetchTenants = useCallback(async () => {
    try {
      const { getUserTenants } = await import('@/app/actions/tenant')
      const userTenants = await getUserTenants()
      setTenants(userTenants)

      // Set first tenant as active if none selected
      if (userTenants.length > 0 && !activeTenant) {
        setActiveTenant(userTenants[0])
      }
    } catch (error) {
      console.error('Error fetching tenants:', error)
    } finally {
      setIsLoading(false)
    }
  }, [activeTenant])

  useEffect(() => {
    refetchTenants()
  }, [refetchTenants])

  const switchTenant = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId)
    if (tenant) {
      setActiveTenant(tenant)
    }
  }

  return (
    <TenantContext.Provider
      value={{
        activeTenant,
        tenants,
        setActiveTenant,
        switchTenant,
        isLoading,
        refetchTenants,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}
