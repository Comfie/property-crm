/**
 * Properties Feature Module
 * Exports all property-related functionality
 */

// Repository
export { propertyRepository, PropertyRepository } from './repositories/property.repository';

// Service
export { propertyService, PropertyService } from './services/property.service';

// DTOs and Validators
export {
  createPropertySchema,
  updatePropertySchema,
  listPropertiesSchema,
  propertyIdSchema,
  updateStatusSchema,
  updateAvailabilitySchema,
  bulkImportPropertiesSchema,
  type CreatePropertyDTO,
  type UpdatePropertyDTO,
  type ListPropertiesDTO,
  type PropertyIdDTO,
  type UpdateStatusDTO,
  type UpdateAvailabilityDTO,
  type BulkImportPropertiesDTO,
} from './dtos/property.dto';
