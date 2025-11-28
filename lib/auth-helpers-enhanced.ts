import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { UnauthorizedError, ForbiddenError } from '@/lib/shared/errors';

/**
 * Requires that the user has access to a specific resource
 * Access is granted if:
 * 1. User owns the resource (resourceUserId matches session.user.organizationId)
 * 2. User is a team member with accepted status
 *
 * @param resourceUserId - The userId who owns the resource
 * @throws {UnauthorizedError} If not authenticated
 * @throws {ForbiddenError} If user doesn't have access
 * @returns {Session} The authenticated session
 *
 * @example
 * ```typescript
 * const session = await requireResourceAccess(property.userId);
 * // User can now access the property
 * ```
 */
export async function requireResourceAccess(resourceUserId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  // User is accessing their own organization's resources
  if (session.user.organizationId === resourceUserId) {
    return session;
  }

  // Check if user is a team member with access to this organization
  const teamMember = await prisma.teamMember.findFirst({
    where: {
      userId: resourceUserId, // The resource owner
      email: session.user.email || '',
      status: 'ACCEPTED',
    },
  });

  if (!teamMember) {
    throw new ForbiddenError('You do not have access to this resource');
  }

  return session;
}

/**
 * Requires that the user has a specific permission for a resource
 * Permissions are: canManageProperties, canManageBookings, canManageTenants, canManageFinancials, canViewReports
 *
 * @param resourceUserId - The userId who owns the resource
 * @param permission - The required permission
 * @throws {UnauthorizedError} If not authenticated
 * @throws {ForbiddenError} If user doesn't have the permission
 * @returns {Session} The authenticated session
 *
 * @example
 * ```typescript
 * const session = await requirePermission(property.userId, 'canManageProperties');
 * // User can now manage properties
 * ```
 */
export async function requirePermission(
  resourceUserId: string,
  permission:
    | 'canManageProperties'
    | 'canManageBookings'
    | 'canManageTenants'
    | 'canManageFinancials'
    | 'canViewReports'
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  // Resource owner has all permissions
  if (session.user.organizationId === resourceUserId) {
    return session;
  }

  // Check team member permissions
  const teamMember = await prisma.teamMember.findFirst({
    where: {
      userId: resourceUserId,
      email: session.user.email || '',
      status: 'ACCEPTED',
      [permission]: true, // Must have specific permission
    },
  });

  if (!teamMember) {
    throw new ForbiddenError(`You do not have permission to perform this action`);
  }

  return session;
}

/**
 * Get all organizations (workspaces) the user has access to
 * Includes user's own workspace and any team memberships
 *
 * @returns Array of organizations with id, name, and access type
 *
 * @example
 * ```typescript
 * const orgs = await getUserOrganizations();
 * // Returns: [
 * //   { id: 'user-123', name: 'John Doe', isOwner: true },
 * //   { id: 'user-456', name: 'Jane Smith', isOwner: false, role: 'MANAGER' }
 * // ]
 * ```
 */
export async function getUserOrganizations() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  const organizations: Array<{
    id: string;
    name: string;
    isOwner: boolean;
    role?: string;
    permissions?: {
      canManageProperties: boolean;
      canManageBookings: boolean;
      canManageTenants: boolean;
      canManageFinancials: boolean;
      canViewReports: boolean;
    };
  }> = [];

  // Add user's own organization
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, firstName: true, lastName: true },
  });

  if (user) {
    organizations.push({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      isOwner: true,
    });
  }

  // Add team memberships
  const teamMemberships = await prisma.teamMember.findMany({
    where: {
      email: session.user.email || '',
      status: 'ACCEPTED',
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  for (const membership of teamMemberships) {
    organizations.push({
      id: membership.user.id,
      name: `${membership.user.firstName} ${membership.user.lastName}`,
      isOwner: false,
      role: membership.role,
      permissions: {
        canManageProperties: membership.canManageProperties,
        canManageBookings: membership.canManageBookings,
        canManageTenants: membership.canManageTenants,
        canManageFinancials: membership.canManageFinancials,
        canViewReports: membership.canViewReports,
      },
    });
  }

  return organizations;
}
