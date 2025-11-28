import { Prisma, TenantStatus } from '@prisma/client';
import { prisma } from '@/lib/db';

/**
 * Tenant Repository
 * Handles all database operations for tenants
 */
export class TenantRepository {
  /**
   * Find tenant by ID
   */
  async findById(id: string) {
    return prisma.tenant.findUnique({
      where: { id },
      include: {
        bookings: {
          orderBy: { checkInDate: 'desc' },
          take: 5,
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
          take: 5,
        },
      },
    });
  }

  /**
   * Find tenant by email
   */
  async findByEmail(email: string) {
    return prisma.tenant.findFirst({
      where: { email },
    });
  }

  /**
   * Find all tenants for a user
   */
  async findByUserId(
    userId: string,
    filters?: {
      status?: TenantStatus;
      search?: string;
    }
  ) {
    const where: Prisma.TenantWhereInput = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
        { idNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return prisma.tenant.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a new tenant
   */
  async create(data: Prisma.TenantCreateInput) {
    return prisma.tenant.create({
      data,
    });
  }

  /**
   * Update a tenant
   */
  async update(id: string, data: Prisma.TenantUpdateInput) {
    return prisma.tenant.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a tenant
   */
  async delete(id: string) {
    return prisma.tenant.delete({
      where: { id },
    });
  }

  /**
   * Get tenant statistics
   */
  async getStatistics(userId: string) {
    const [total, active, inactive, blacklisted] = await Promise.all([
      prisma.tenant.count({ where: { userId } }),
      prisma.tenant.count({ where: { userId, status: 'ACTIVE' } }),
      prisma.tenant.count({ where: { userId, status: 'INACTIVE' } }),
      prisma.tenant.count({ where: { userId, status: 'BLACKLISTED' } }),
    ]);

    return {
      total,
      active,
      inactive,
      blacklisted,
    };
  }

  /**
   * Get active tenants
   */
  async findActive(userId: string) {
    return prisma.tenant.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      orderBy: { lastName: 'asc' },
    });
  }

  /**
   * Get tenants with upcoming lease expiry
   * Note: Lease dates are in PropertyTenant model, not Tenant
   */
  async findWithUpcomingLeaseExpiry(userId: string, days = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return prisma.tenant.findMany({
      where: {
        userId,
        status: 'ACTIVE',
        properties: {
          some: {
            isActive: true,
            AND: [
              { leaseEndDate: { not: null } },
              { leaseEndDate: { gte: new Date() } },
              { leaseEndDate: { lte: futureDate } },
            ],
          },
        },
      },
      include: {
        properties: {
          where: {
            isActive: true,
            AND: [
              { leaseEndDate: { not: null } },
              { leaseEndDate: { gte: new Date() } },
              { leaseEndDate: { lte: futureDate } },
            ],
          },
          include: {
            property: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

// Export singleton instance
export const tenantRepository = new TenantRepository();
