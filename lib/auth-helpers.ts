import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

/**
 * Requires that the user is authenticated and has the SUPER_ADMIN role
 * @throws {NextResponse} 401 if not authenticated, 403 if not super admin
 * @returns {Session} The authenticated session
 */
export async function requireSuperAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'SUPER_ADMIN') {
    throw NextResponse.json({ error: 'Forbidden - Super admin access required' }, { status: 403 });
  }

  return session;
}

/**
 * Requires that the user is authenticated and has the CUSTOMER role
 * @throws {NextResponse} 401 if not authenticated, 403 if not customer
 * @returns {Session} The authenticated session
 */
export async function requireCustomer() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'CUSTOMER') {
    throw NextResponse.json({ error: 'Forbidden - Customer access required' }, { status: 403 });
  }

  return session;
}

/**
 * Requires that the user is authenticated and has the TENANT role
 * @throws {NextResponse} 401 if not authenticated, 403 if not tenant
 * @returns {Session} The authenticated session
 */
export async function requireTenant() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'TENANT') {
    throw NextResponse.json({ error: 'Forbidden - Tenant access required' }, { status: 403 });
  }

  return session;
}

/**
 * Requires that the user is authenticated (any role)
 * @throws {NextResponse} 401 if not authenticated
 * @returns {Session} The authenticated session
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return session;
}

/**
 * Gets the redirect path based on user role
 */
export function getRedirectPathForRole(role: UserRole): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/admin/users';
    case 'CUSTOMER':
      return '/dashboard';
    case 'TENANT':
      return '/tenant/dashboard';
    default:
      return '/dashboard';
  }
}
