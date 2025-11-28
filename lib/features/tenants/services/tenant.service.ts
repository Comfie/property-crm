import { TenantStatus } from '@prisma/client';
import { tenantRepository } from '@/lib/features/tenants/repositories/tenant.repository';
import { logger } from '@/lib/shared/logger';
import { ValidationError, NotFoundError, ForbiddenError } from '@/lib/shared/errors/app-error';

/**
 * Tenant Service
 * Business logic layer for tenants
 */
export class TenantService {
  /**
   * Create a new tenant
   */
  async create(
    userId: string,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      idNumber?: string;
      dateOfBirth?: Date;
      occupation?: string;
      employer?: string;
      emergencyContact?: string;
      emergencyPhone?: string;
      leaseStartDate?: Date;
      leaseEndDate?: Date;
      monthlyRent?: number;
      securityDeposit?: number;
      notes?: string;
    }
  ) {
    // Validation: Check if email already exists
    const existing = await tenantRepository.findByEmail(data.email);
    if (existing) {
      throw new ValidationError('A tenant with this email already exists', {
        email: data.email,
        existingTenantId: existing.id,
      });
    }

    const tenant = await tenantRepository.create({
      user: { connect: { id: userId } },
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      idNumber: data.idNumber,
      dateOfBirth: data.dateOfBirth,
      employer: data.employer,
      emergencyContactName: data.emergencyContact,
      emergencyContactPhone: data.emergencyPhone,
      status: 'ACTIVE',
    });

    logger.info('Tenant created', {
      tenantId: tenant.id,
      userId,
      email: data.email,
    });

    return tenant;
  }

  /**
   * Update a tenant
   */
  async update(
    tenantId: string,
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      idNumber?: string;
      dateOfBirth?: Date;
      occupation?: string;
      employer?: string;
      emergencyContact?: string;
      emergencyPhone?: string;
      leaseStartDate?: Date;
      leaseEndDate?: Date;
      monthlyRent?: number;
      securityDeposit?: number;
      notes?: string;
      status?: TenantStatus;
    }
  ) {
    const tenant = await tenantRepository.findById(tenantId);

    if (!tenant) {
      throw new NotFoundError('Tenant', tenantId);
    }

    if (tenant.userId !== userId) {
      throw new ForbiddenError('You do not have permission to update this tenant');
    }

    // Validation: If email is being changed, check it doesn't exist
    if (data.email && data.email !== tenant.email) {
      const existing = await tenantRepository.findByEmail(data.email);
      if (existing) {
        throw new ValidationError('A tenant with this email already exists', {
          email: data.email,
          existingTenantId: existing.id,
        });
      }
    }

    const updated = await tenantRepository.update(tenantId, data);

    logger.info('Tenant updated', {
      tenantId,
      userId,
      changes: Object.keys(data),
    });

    return updated;
  }

  /**
   * Delete a tenant
   */
  async delete(tenantId: string, userId: string) {
    const tenant = await tenantRepository.findById(tenantId);

    if (!tenant) {
      throw new NotFoundError('Tenant', tenantId);
    }

    if (tenant.userId !== userId) {
      throw new ForbiddenError('You do not have permission to delete this tenant');
    }

    // Check if tenant has active bookings
    const hasActiveBookings = tenant.bookings?.some(
      (booking) => booking.status === 'CONFIRMED' || booking.status === 'CHECKED_IN'
    );

    if (hasActiveBookings) {
      throw new ValidationError(
        'Cannot delete tenant with active bookings. Please cancel or complete bookings first.',
        { tenantId, activeBookings: tenant.bookings?.length }
      );
    }

    await tenantRepository.delete(tenantId);

    logger.info('Tenant deleted', {
      tenantId,
      userId,
    });

    return { success: true };
  }

  /**
   * Get tenant by ID with ownership verification
   */
  async getById(tenantId: string, userId: string) {
    const tenant = await tenantRepository.findById(tenantId);

    if (!tenant) {
      throw new NotFoundError('Tenant', tenantId);
    }

    if (tenant.userId !== userId) {
      throw new ForbiddenError('You do not have permission to view this tenant');
    }

    return tenant;
  }

  /**
   * List tenants with filters
   */
  async list(
    userId: string,
    filters?: {
      status?: TenantStatus;
      search?: string;
    }
  ) {
    return tenantRepository.findByUserId(userId, filters);
  }

  /**
   * Get tenant statistics
   */
  async getStatistics(userId: string) {
    return tenantRepository.getStatistics(userId);
  }

  /**
   * Get active tenants
   */
  async getActive(userId: string) {
    return tenantRepository.findActive(userId);
  }

  /**
   * Get tenants with upcoming lease expiry
   */
  async getWithUpcomingLeaseExpiry(userId: string, days = 30) {
    return tenantRepository.findWithUpcomingLeaseExpiry(userId, days);
  }

  /**
   * Update tenant status
   */
  async updateStatus(tenantId: string, userId: string, status: TenantStatus) {
    const tenant = await this.getById(tenantId, userId);

    const updated = await tenantRepository.update(tenantId, { status });

    logger.info('Tenant status updated', {
      tenantId,
      userId,
      oldStatus: tenant.status,
      newStatus: status,
    });

    return updated;
  }
}

// Export singleton instance
export const tenantService = new TenantService();
