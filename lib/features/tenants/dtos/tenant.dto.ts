import { z } from 'zod';
import { TenantStatus } from '@prisma/client';

/**
 * Create Tenant DTO
 */
export const createTenantSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  idNumber: z.string().max(50).optional(),
  dateOfBirth: z.coerce.date().optional(),
  occupation: z.string().max(200).optional(),
  employer: z.string().max(200).optional(),
  emergencyContact: z.string().max(100).optional(),
  emergencyPhone: z.string().max(20).optional(),
  leaseStartDate: z.coerce.date().optional(),
  leaseEndDate: z.coerce.date().optional(),
  monthlyRent: z.number().positive().optional(),
  securityDeposit: z.number().min(0).optional(),
  notes: z.string().max(2000).optional(),
});

export type CreateTenantDTO = z.infer<typeof createTenantSchema>;

/**
 * Update Tenant DTO
 */
export const updateTenantSchema = z.object({
  firstName: z.string().min(2).max(100).optional(),
  lastName: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(20).optional(),
  idNumber: z.string().max(50).optional(),
  dateOfBirth: z.coerce.date().optional(),
  occupation: z.string().max(200).optional(),
  employer: z.string().max(200).optional(),
  emergencyContact: z.string().max(100).optional(),
  emergencyPhone: z.string().max(20).optional(),
  leaseStartDate: z.coerce.date().optional(),
  leaseEndDate: z.coerce.date().optional(),
  monthlyRent: z.number().positive().optional(),
  securityDeposit: z.number().min(0).optional(),
  notes: z.string().max(2000).optional(),
  status: z.nativeEnum(TenantStatus).optional(),
});

export type UpdateTenantDTO = z.infer<typeof updateTenantSchema>;

/**
 * List Tenants Query DTO
 */
export const listTenantsSchema = z.object({
  status: z.nativeEnum(TenantStatus).optional(),
  search: z.string().max(200).optional(),
});

export type ListTenantsDTO = z.infer<typeof listTenantsSchema>;

/**
 * Tenant ID Param DTO
 */
export const tenantIdSchema = z.object({
  id: z.string().min(1, 'Tenant ID is required'),
});

export type TenantIdDTO = z.infer<typeof tenantIdSchema>;

/**
 * Update Status DTO
 */
export const updateTenantStatusSchema = z.object({
  status: z.nativeEnum(TenantStatus),
});

export type UpdateTenantStatusDTO = z.infer<typeof updateTenantStatusSchema>;
