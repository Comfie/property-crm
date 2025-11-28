import { z } from 'zod';
import { PropertyStatus, PropertyType, RentalType } from '@prisma/client';

/**
 * Create Property DTO
 */
export const createPropertySchema = z.object({
  name: z.string().min(2, 'Property name must be at least 2 characters').max(200),
  description: z.string().max(5000).optional(),
  propertyType: z.nativeEnum(PropertyType),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  city: z.string().min(2).max(100),
  province: z.string().min(2).max(100),
  postalCode: z.string().min(3).max(20),
  country: z.string().max(100).optional(),
  bedrooms: z.number().int().min(0).max(50),
  bathrooms: z.number().min(0).max(50),
  size: z.number().positive().optional(),
  furnished: z.boolean().optional(),
  parkingSpaces: z.number().int().min(0).max(20).optional(),
  amenities: z.array(z.string()).optional(),
  primaryImageUrl: z.string().url().optional(),
  rentalType: z.nativeEnum(RentalType).optional(),
  monthlyRent: z.number().positive().optional(),
  dailyRate: z.number().positive().optional(),
  weeklyRate: z.number().positive().optional(),
  monthlyRate: z.number().positive().optional(),
  cleaningFee: z.number().min(0).optional(),
  securityDeposit: z.number().min(0).optional(),
  isAvailable: z.boolean().optional(),
  availableFrom: z.coerce.date().optional(),
  minimumStay: z.number().int().min(1).optional(),
  maximumStay: z.number().int().min(1).optional(),
  petsAllowed: z.boolean().optional(),
  smokingAllowed: z.boolean().optional(),
  checkInTime: z.string().max(10).optional(),
  checkOutTime: z.string().max(10).optional(),
  houseRules: z.string().max(5000).optional(),
});

export type CreatePropertyDTO = z.infer<typeof createPropertySchema>;

/**
 * Update Property DTO
 */
export const updatePropertySchema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().max(5000).optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  address: z.string().min(5).max(500).optional(),
  city: z.string().min(2).max(100).optional(),
  province: z.string().min(2).max(100).optional(),
  postalCode: z.string().min(3).max(20).optional(),
  bedrooms: z.number().int().min(0).max(50).optional(),
  bathrooms: z.number().min(0).max(50).optional(),
  size: z.number().positive().optional(),
  furnished: z.boolean().optional(),
  parkingSpaces: z.number().int().min(0).max(20).optional(),
  amenities: z.array(z.string()).optional(),
  primaryImageUrl: z.string().url().optional(),
  rentalType: z.nativeEnum(RentalType).optional(),
  monthlyRent: z.number().positive().optional(),
  dailyRate: z.number().positive().optional(),
  weeklyRate: z.number().positive().optional(),
  monthlyRate: z.number().positive().optional(),
  cleaningFee: z.number().min(0).optional(),
  securityDeposit: z.number().min(0).optional(),
  isAvailable: z.boolean().optional(),
  availableFrom: z.coerce.date().optional(),
  minimumStay: z.number().int().min(1).optional(),
  maximumStay: z.number().int().min(1).optional(),
  petsAllowed: z.boolean().optional(),
  smokingAllowed: z.boolean().optional(),
  checkInTime: z.string().max(10).optional(),
  checkOutTime: z.string().max(10).optional(),
  houseRules: z.string().max(5000).optional(),
  status: z.nativeEnum(PropertyStatus).optional(),
});

export type UpdatePropertyDTO = z.infer<typeof updatePropertySchema>;

/**
 * List Properties Query DTO
 */
export const listPropertiesSchema = z.object({
  status: z.nativeEnum(PropertyStatus).optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  rentalType: z.nativeEnum(RentalType).optional(),
  isAvailable: z.coerce.boolean().optional(),
  search: z.string().max(200).optional(),
});

export type ListPropertiesDTO = z.infer<typeof listPropertiesSchema>;

/**
 * Property ID Param DTO
 */
export const propertyIdSchema = z.object({
  id: z.string().min(1, 'Property ID is required'),
});

export type PropertyIdDTO = z.infer<typeof propertyIdSchema>;

/**
 * Update Status DTO
 */
export const updateStatusSchema = z.object({
  status: z.nativeEnum(PropertyStatus),
});

export type UpdateStatusDTO = z.infer<typeof updateStatusSchema>;

/**
 * Update Availability DTO
 */
export const updateAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
  availableFrom: z.coerce.date().optional(),
});

export type UpdateAvailabilityDTO = z.infer<typeof updateAvailabilitySchema>;
