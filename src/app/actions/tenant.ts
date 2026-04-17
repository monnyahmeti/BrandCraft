'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Creates a new tenant (brand) and assigns the current user as admin
 */
export async function createTenant(formData: {
  name: string
  slug: string
}) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Validate input
  if (!formData.name || !formData.slug) {
    throw new Error('Name and slug are required')
  }

  if (formData.slug.length < 3 || !/^[a-z0-9-]+$/.test(formData.slug)) {
    throw new Error('Slug must be at least 3 characters and contain only lowercase letters, numbers, and hyphens')
  }

  try {
    // Create tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name: formData.name,
        slug: formData.slug,
        owner_id: user.id,
        plan_type: 'free',
      })
      .select()
      .single()

    if (tenantError) throw tenantError

    // Add user as admin to the tenant
    const { error: memberError } = await supabase.from('tenant_members').insert({
      tenant_id: tenant.id,
      user_id: user.id,
      role: 'admin',
    })

    if (memberError) throw memberError

    return { success: true, tenantId: tenant.id, tenantSlug: tenant.slug }
  } catch (error) {
    console.error('Error creating tenant:', error)
    throw error
  }
}

/**
 * Get all tenants for the current user
 */
export async function getUserTenants() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('tenant_members')
    .select('tenants(id, name, slug, plan_type, created_at)')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching user tenants:', error)
    return []
  }

  return data?.map((member: any) => member.tenants).filter(Boolean) || []
}

/**
 * Get a specific tenant with its members
 */
export async function getTenant(tenantId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Verify user has access to this tenant
  const { data: membership } = await supabase
    .from('tenant_members')
    .select('role')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    throw new Error('Access denied')
  }

  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single()

  if (error) throw error

  return tenant
}

/**
 * Get tenant members
 */
export async function getTenantMembers(tenantId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Verify user has access
  const { data: membership } = await supabase
    .from('tenant_members')
    .select('role')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    throw new Error('Access denied')
  }

  const { data: members, error } = await supabase
    .from('tenant_members')
    .select(`
      id,
      role,
      created_at,
      profiles:user_id (
        id,
        email,
        full_name,
        avatar_url
      )
    `)
    .eq('tenant_id', tenantId)

  if (error) throw error

  return members || []
}

/**
 * Invite a user to a tenant
 */
export async function inviteTenantMember(tenantId: string, _email: string, _role: 'admin' | 'editor' | 'viewer') {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Verify user is admin of this tenant
  const { data: membership } = await supabase
    .from('tenant_members')
    .select('role')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .single()

  if (membership?.role !== 'admin') {
    throw new Error('Only admins can invite members')
  }

  // TODO: Send invitation email with the provided email and role
  // For now, just return a success message

  return { success: true, message: 'Invitation sent (feature in development)' }
}
