import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError } from '@/lib/shared/errors';
import { logger } from '@/lib/shared/logger';
import { z } from 'zod';

const switchOrganizationSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
});

/**
 * POST /api/auth/switch-organization
 * Switches the current user's active organization context
 *
 * This allows users who are team members of multiple organizations
 * to switch between different workspaces.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { organizationId } = switchOrganizationSchema.parse(body);

    logger.info('Organization switch requested', {
      userId: session.user.id,
      currentOrg: session.user.organizationId,
      requestedOrg: organizationId,
    });

    // Validate that the user has access to this organization
    // This will be verified again in the JWT callback
    if (organizationId !== session.user.id) {
      const { prisma } = await import('@/lib/db');
      const teamMember = await prisma.teamMember.findFirst({
        where: {
          userId: organizationId,
          email: session.user.email || '',
          status: 'ACCEPTED',
        },
      });

      if (!teamMember) {
        logger.warn('Unauthorized organization switch attempt', {
          userId: session.user.id,
          requestedOrg: organizationId,
        });

        return NextResponse.json(
          { error: 'You do not have access to this organization' },
          { status: 403 }
        );
      }
    }

    // Update the session by triggering the JWT callback
    // The actual switching logic is in lib/auth.ts jwt callback
    const response = NextResponse.json({
      success: true,
      message: 'Organization switched successfully',
      organizationId,
    });

    // The session update will be handled by the client calling update()
    // from next-auth/react

    logger.info('Organization switch successful', {
      userId: session.user.id,
      newOrg: organizationId,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/auth/switch-organization
 * Get list of organizations the user can switch to
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { getUserOrganizations } = await import('@/lib/auth-helpers-enhanced');
    const organizations = await getUserOrganizations();

    return NextResponse.json({
      success: true,
      data: organizations,
      current: session.user.organizationId,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
