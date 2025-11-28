import { z } from 'zod';
import { BookingStatus } from '@prisma/client';

/**
 * Booking DTOs and Validators
 * Input validation schemas for booking operations
 */

/**
 * Create Booking DTO
 */
export const createBookingSchema = z
  .object({
    propertyId: z.string().min(1, 'Property ID is required'),
    tenantId: z.string().min(1).optional(),
    guestName: z.string().min(2, 'Guest name must be at least 2 characters').max(100),
    guestEmail: z.string().email('Invalid email address'),
    guestPhone: z
      .string()
      .min(10, 'Phone number must be at least 10 characters')
      .max(20)
      .optional(),
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
    numberOfGuests: z.number().int().min(1, 'Number of guests must be at least 1').max(50),
    totalAmount: z.number().positive('Total amount must be positive').optional(),
    bookingSource: z.string().max(50).optional(),
    bookingReference: z.string().max(100).optional(),
    specialRequests: z.string().max(1000).optional(),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  });

export type CreateBookingDTO = z.infer<typeof createBookingSchema>;

/**
 * Update Booking DTO
 */
export const updateBookingSchema = z
  .object({
    checkInDate: z.coerce.date().optional(),
    checkOutDate: z.coerce.date().optional(),
    numberOfGuests: z.number().int().min(1).max(50).optional(),
    status: z.nativeEnum(BookingStatus).optional(),
    guestName: z.string().min(2).max(100).optional(),
    guestEmail: z.string().email().optional(),
    guestPhone: z.string().min(10).max(20).optional(),
    specialRequests: z.string().max(1000).optional(),
  })
  .refine(
    (data) => {
      if (data.checkInDate && data.checkOutDate) {
        return data.checkOutDate > data.checkInDate;
      }
      return true;
    },
    {
      message: 'Check-out date must be after check-in date',
      path: ['checkOutDate'],
    }
  );

export type UpdateBookingDTO = z.infer<typeof updateBookingSchema>;

/**
 * Cancel Booking DTO
 */
export const cancelBookingSchema = z.object({
  reason: z
    .string()
    .min(5, 'Cancellation reason must be at least 5 characters')
    .max(500)
    .optional(),
});

export type CancelBookingDTO = z.infer<typeof cancelBookingSchema>;

/**
 * Check Availability DTO
 */
export const checkAvailabilitySchema = z
  .object({
    propertyId: z.string().min(1, 'Property ID is required'),
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
    excludeBookingId: z.string().min(1).optional(),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  });

export type CheckAvailabilityDTO = z.infer<typeof checkAvailabilitySchema>;

/**
 * List Bookings Query DTO
 */
export const listBookingsSchema = z.object({
  propertyId: z.string().min(1).optional(),
  status: z.nativeEnum(BookingStatus).optional(),
  source: z.string().max(50).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().max(100).optional(),
});

export type ListBookingsDTO = z.infer<typeof listBookingsSchema>;

/**
 * Booking ID Param DTO
 */
export const bookingIdSchema = z.object({
  id: z.string().min(1, 'Booking ID is required'),
});

export type BookingIdDTO = z.infer<typeof bookingIdSchema>;

/**
 * Upcoming Bookings Query DTO
 */
export const upcomingBookingsSchema = z.object({
  days: z.coerce.number().int().min(1).max(90).default(7),
});

export type UpcomingBookingsDTO = z.infer<typeof upcomingBookingsSchema>;
