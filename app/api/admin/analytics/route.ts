import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/auth-helpers';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await requireSuperAdmin();

    // Get all landlords (CUSTOMER role)
    const landlords = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        createdAt: true,
      },
    });

    // Calculate Total MRR
    let totalMRR = 0;
    const revenueByTier = {
      FREE: 0,
      STARTER: 0,
      PROFESSIONAL: 0,
      ENTERPRISE: 0,
    };

    landlords.forEach((landlord) => {
      if (landlord.subscriptionStatus === 'ACTIVE') {
        let mrr = 0;
        switch (landlord.subscriptionTier) {
          case 'STARTER':
            mrr = 199;
            revenueByTier.STARTER += mrr;
            break;
          case 'PROFESSIONAL':
            mrr = 499;
            revenueByTier.PROFESSIONAL += mrr;
            break;
          case 'ENTERPRISE':
            mrr = 999;
            revenueByTier.ENTERPRISE += mrr;
            break;
        }
        totalMRR += mrr;
      }
    });

    // Count by status
    const totalLandlords = landlords.length;
    const activeLandlords = landlords.filter((l) => l.subscriptionStatus === 'ACTIVE').length;
    const trialUsers = landlords.filter((l) => l.subscriptionStatus === 'TRIAL').length;
    const cancelledUsers = landlords.filter((l) => l.subscriptionStatus === 'CANCELLED').length;
    const expiredUsers = landlords.filter((l) => l.subscriptionStatus === 'EXPIRED').length;

    // Get total properties across all landlords
    const totalProperties = await prisma.property.count({
      where: {
        user: { role: 'CUSTOMER' },
      },
    });

    // Get total bookings across all landlords
    const totalBookings = await prisma.booking.count({
      where: {
        user: { role: 'CUSTOMER' },
      },
    });

    // Get total tenants across all landlords
    const totalTenants = await prisma.tenant.count({
      where: {
        user: { role: 'CUSTOMER' },
      },
    });

    // Calculate churn rate (cancelled in last 30 days / total active at start of month)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCancellations = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        subscriptionStatus: 'CANCELLED',
        updatedAt: { gte: thirtyDaysAgo },
      },
    });

    const churnRate = activeLandlords > 0 ? (recentCancellations / activeLandlords) * 100 : 0;

    // User growth over last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        role: 'CUSTOMER',
        createdAt: { gte: twelveMonthsAgo },
      },
      _count: true,
    });

    // Group by month
    const growthByMonth: { [key: string]: number } = {};
    userGrowth.forEach((item) => {
      const month = new Date(item.createdAt).toISOString().substring(0, 7); // YYYY-MM
      growthByMonth[month] = (growthByMonth[month] || 0) + item._count;
    });

    // Recent signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSignups = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        createdAt: { gte: sevenDaysAgo },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        subscriptionTier: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Recent cancellations (last 7 days)
    const recentCancellationsList = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        subscriptionStatus: 'CANCELLED',
        updatedAt: { gte: sevenDaysAgo },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        subscriptionTier: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      metrics: {
        totalMRR,
        totalLandlords,
        activeLandlords,
        trialUsers,
        totalProperties,
        totalBookings,
        totalTenants,
        churnRate: parseFloat(churnRate.toFixed(2)),
        cancelledUsers,
        expiredUsers,
      },
      revenueByTier,
      userGrowth: Object.entries(growthByMonth).map(([month, count]) => ({
        month,
        count,
      })),
      recentSignups,
      recentCancellations: recentCancellationsList,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
