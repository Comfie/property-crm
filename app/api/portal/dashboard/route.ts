import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find tenant record matching user's email
    const tenant = await prisma.tenant.findFirst({
      where: { email: session.user.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        userId: true,
        properties: {
          where: { isActive: true },
          select: {
            propertyId: true,
            leaseStartDate: true,
            leaseEndDate: true,
            monthlyRent: true,
            property: {
              select: {
                id: true,
                name: true,
                address: true,
                city: true,
              },
            },
          },
          take: 1,
        },
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'No tenant record found for this email' }, { status: 404 });
    }

    // Get maintenance requests for this tenant
    const maintenanceRequests = await prisma.maintenanceRequest.findMany({
      where: { tenantId: tenant.id },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Get recent payments for this tenant
    const recentPayments = await prisma.payment.findMany({
      where: { tenantId: tenant.id },
      select: {
        id: true,
        amount: true,
        paymentDate: true,
        status: true,
      },
      orderBy: { paymentDate: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      tenant,
      maintenanceRequests,
      recentPayments,
    });
  } catch (error) {
    console.error('Tenant portal dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
