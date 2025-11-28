/**
 * Maintenance Feature Module
 * Exports all maintenance-related functionality
 */

// Repository
export {
  maintenanceRepository,
  MaintenanceRepository,
} from './repositories/maintenance.repository';

// Service
export { maintenanceService, MaintenanceService } from './services/maintenance.service';

// DTOs and Validators
export {
  createMaintenanceSchema,
  updateMaintenanceSchema,
  listMaintenanceSchema,
  maintenanceIdSchema,
  updateMaintenanceStatusSchema,
  assignMaintenanceSchema,
  type CreateMaintenanceDTO,
  type UpdateMaintenanceDTO,
  type ListMaintenanceDTO,
  type MaintenanceIdDTO,
  type UpdateMaintenanceStatusDTO,
  type AssignMaintenanceDTO,
} from './dtos/maintenance.dto';
