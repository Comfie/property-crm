import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

const portalAccessSchema = z.object({
  action: z.enum(['create', 'reset', 'revoke']),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

// POST /api/tenants/[id]/portal-access - Manage portal access for tenant
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = portalAccessSchema.parse(body);

    // Find the tenant and verify ownership
    const tenant = await prisma.tenant.findFirst({
      where: {
        id,
        user: {
          id: session.user.id,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            accountType: true,
          },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Check if tenant already has a separate user account (TENANT account type)
    const hasPortalAccess = tenant.user.accountType === 'TENANT';

    // Handle different actions
    switch (validatedData.action) {
      case 'create': {
        if (hasPortalAccess) {
          return NextResponse.json({ error: 'Tenant already has portal access' }, { status: 400 });
        }

        if (!validatedData.password) {
          return NextResponse.json(
            { error: 'Password is required when creating portal access' },
            { status: 400 }
          );
        }

        // Check if user with this email already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: tenant.email },
        });

        if (existingUser) {
          return NextResponse.json(
            { error: 'A user account with this email already exists' },
            { status: 400 }
          );
        }

        // Create tenant user account
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        const tenantUser = await prisma.user.create({
          data: {
            email: tenant.email,
            password: hashedPassword,
            firstName: tenant.firstName,
            lastName: tenant.lastName,
            phone: tenant.phone || '',
            accountType: 'TENANT',
            isActive: true,
            emailVerified: false,
            propertyLimit: 0,
          },
        });

        // Update tenant to link to new user account
        await prisma.tenant.update({
          where: { id: tenant.id },
          data: { userId: tenantUser.id },
        });

        return NextResponse.json({
          success: true,
          message: 'Portal access created successfully',
        });
      }

      case 'reset': {
        if (!hasPortalAccess) {
          return NextResponse.json(
            { error: 'Tenant does not have portal access' },
            { status: 400 }
          );
        }

        if (!validatedData.password) {
          return NextResponse.json(
            { error: 'New password is required when resetting portal access' },
            { status: 400 }
          );
        }

        // Update password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        await prisma.user.update({
          where: { id: tenant.userId },
          data: { password: hashedPassword },
        });

        return NextResponse.json({
          success: true,
          message: 'Password reset successfully',
        });
      }

      case 'revoke': {
        if (!hasPortalAccess) {
          return NextResponse.json(
            { error: 'Tenant does not have portal access' },
            { status: 400 }
          );
        }

        // Delete the tenant user account and relink tenant to property manager
        await prisma.user.delete({
          where: { id: tenant.userId },
        });

        // Update tenant to link back to property manager
        await prisma.tenant.update({
          where: { id: tenant.id },
          data: { userId: session.user.id },
        });

        return NextResponse.json({
          success: true,
          message: 'Portal access revoked successfully',
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error managing portal access:', error);
    return NextResponse.json({ error: 'Failed to manage portal access' }, { status: 500 });
  }
}

// GET /api/tenants/[id]/portal-access - Check if tenant has portal access
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Find the tenant and verify ownership
    const tenant = await prisma.tenant.findFirst({
      where: {
        id,
        user: {
          id: session.user.id,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            accountType: true,
            createdAt: true,
          },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const hasPortalAccess = tenant.user.accountType === 'TENANT';

    return NextResponse.json({
      hasPortalAccess,
      userAccountId: hasPortalAccess ? tenant.user.id : null,
      createdAt: hasPortalAccess ? tenant.user.createdAt : null,
    });
  } catch (error) {
    console.error('Error fetching portal access:', error);
    return NextResponse.json({ error: 'Failed to fetch portal access' }, { status: 500 });
  }
}
