import { MaintenanceStatus, Priority, MaintenanceCategory } from '@prisma/client';
import { maintenanceRepository } from '@/lib/features/maintenance/repositories/maintenance.repository';
import { logger } from '@/lib/shared/logger';
import { ValidationError, NotFoundError, ForbiddenError } from '@/lib/shared/errors/app-error';
import { prisma } from '@/lib/db';

/**
 * Maintenance Service
 * Business logic layer for maintenance requests
 */
export class MaintenanceService {
  /**
   * Create a new maintenance request
   */
  async create(
    userId: string,
    data: {
      propertyId: string;
      tenantId?: string;
      title: string;
      description: string;
      category: MaintenanceCategory;
      priority: Priority;
      scheduledDate?: Date;
      estimatedCost?: number;
    }
  ) {
    // Validation: Verify property belongs to user
    const property = await prisma.property.findFirst({
      where: {
        id: data.propertyId,
        userId,
      },
    });

    if (!property) {
      throw new NotFoundError('Property', data.propertyId);
    }

    // If tenant specified, verify tenant belongs to user
    if (data.tenantId) {
      const tenant = await prisma.tenant.findFirst({
        where: {
          id: data.tenantId,
          userId,
        },
      });

      if (!tenant) {
        throw new NotFoundError('Tenant', data.tenantId);
      }
    }

    const maintenance = await maintenanceRepository.create({
      user: { connect: { id: userId } },
      property: { connect: { id: data.propertyId } },
      ...(data.tenantId && { tenant: { connect: { id: data.tenantId } } }),
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'PENDING',
      scheduledDate: data.scheduledDate,
      estimatedCost: data.estimatedCost,
    });

    logger.info('Maintenance request created', {
      maintenanceId: maintenance.id,
      userId,
      propertyId: data.propertyId,
      priority: data.priority,
    });

    return maintenance;
  }

  /**
   * Update a maintenance request
   */
  async update(
    maintenanceId: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      category?: MaintenanceCategory;
      priority?: Priority;
      status?: MaintenanceStatus;
      scheduledDate?: Date;
      completedDate?: Date;
      estimatedCost?: number;
      actualCost?: number;
      assignedTo?: string;
      resolutionNotes?: string;
    }
  ) {
    const maintenance = await maintenanceRepository.findById(maintenanceId);

    if (!maintenance) {
      throw new NotFoundError('Maintenance request', maintenanceId);
    }

    if (maintenance.userId !== userId) {
      throw new ForbiddenError('You do not have permission to update this maintenance request');
    }

    // Business rule: If marking as completed, require completed date and actual cost
    if (data.status === 'COMPLETED') {
      if (!data.completedDate) {
        data.completedDate = new Date();
      }
    }

    const updated = await maintenanceRepository.update(maintenanceId, data);

    logger.info('Maintenance request updated', {
      maintenanceId,
      userId,
      changes: Object.keys(data),
    });

    return updated;
  }

  /**
   * Delete a maintenance request
   */
  async delete(maintenanceId: string, userId: string) {
    const maintenance = await maintenanceRepository.findById(maintenanceId);

    if (!maintenance) {
      throw new NotFoundError('Maintenance request', maintenanceId);
    }

    if (maintenance.userId !== userId) {
      throw new ForbiddenError('You do not have permission to delete this maintenance request');
    }

    // Business rule: Cannot delete completed maintenance requests
    if (maintenance.status === 'COMPLETED') {
      throw new ValidationError(
        'Cannot delete completed maintenance requests. Consider cancelling instead.',
        { maintenanceId, status: maintenance.status }
      );
    }

    await maintenanceRepository.delete(maintenanceId);

    logger.info('Maintenance request deleted', {
      maintenanceId,
      userId,
    });

    return { success: true };
  }

  /**
   * Get maintenance request by ID with ownership verification
   */
  async getById(maintenanceId: string, userId: string) {
    const maintenance = await maintenanceRepository.findById(maintenanceId);

    if (!maintenance) {
      throw new NotFoundError('Maintenance request', maintenanceId);
    }

    if (maintenance.userId !== userId) {
      throw new ForbiddenError('You do not have permission to view this maintenance request');
    }

    return maintenance;
  }

  /**
   * List maintenance requests with filters
   */
  async list(
    userId: string,
    filters?: {
      propertyId?: string;
      status?: MaintenanceStatus;
      priority?: Priority;
      category?: MaintenanceCategory;
      search?: string;
    }
  ) {
    return maintenanceRepository.findByUserId(userId, filters);
  }

  /**
   * Get maintenance requests for a specific property
   */
  async getByPropertyId(propertyId: string, userId: string) {
    // Verify property belongs to user
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        userId,
      },
    });

    if (!property) {
      throw new NotFoundError('Property', propertyId);
    }

    return maintenanceRepository.findByPropertyId(propertyId);
  }

  /**
   * Get maintenance statistics
   */
  async getStatistics(userId: string) {
    return maintenanceRepository.getStatistics(userId);
  }

  /**
   * Get urgent maintenance requests
   */
  async getUrgent(userId: string) {
    return maintenanceRepository.findUrgent(userId);
  }

  /**
   * Get pending maintenance requests
   */
  async getPending(userId: string) {
    return maintenanceRepository.findPending(userId);
  }

  /**
   * Update maintenance status
   */
  async updateStatus(
    maintenanceId: string,
    userId: string,
    status: MaintenanceStatus,
    resolutionNotes?: string
  ) {
    const maintenance = await this.getById(maintenanceId, userId);

    const updateData: any = { status };

    if (status === 'COMPLETED') {
      updateData.completedDate = new Date();
    }

    if (resolutionNotes) {
      updateData.resolutionNotes = resolutionNotes;
    }

    const updated = await maintenanceRepository.update(maintenanceId, updateData);

    logger.info('Maintenance status updated', {
      maintenanceId,
      userId,
      oldStatus: maintenance.status,
      newStatus: status,
    });

    return updated;
  }

  /**
   * Assign maintenance request to someone
   */
  async assign(maintenanceId: string, userId: string, assignedTo: string) {
    const maintenance = await this.getById(maintenanceId, userId);

    const updated = await maintenanceRepository.update(maintenanceId, {
      assignedTo,
      status: maintenance.status === 'PENDING' ? 'IN_PROGRESS' : maintenance.status,
    });

    logger.info('Maintenance request assigned', {
      maintenanceId,
      userId,
      assignedTo,
    });

    return updated;
  }
}

// Export singleton instance
export const maintenanceService = new MaintenanceService();
