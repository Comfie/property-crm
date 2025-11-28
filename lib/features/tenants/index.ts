/**
 * Tenants Feature Module
 * Exports all tenant-related functionality
 */

// Repository
export { tenantRepository, TenantRepository } from './repositories/tenant.repository';

// Service
export { tenantService, TenantService } from './services/tenant.service';

// DTOs and Validators
export {
  createTenantSchema,
  updateTenantSchema,
  listTenantsSchema,
  tenantIdSchema,
  updateTenantStatusSchema,
  type CreateTenantDTO,
  type UpdateTenantDTO,
  type ListTenantsDTO,
  type TenantIdDTO,
  type UpdateTenantStatusDTO,
} from './dtos/tenant.dto';
