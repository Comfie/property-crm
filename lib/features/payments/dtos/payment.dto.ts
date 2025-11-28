import { z } from 'zod';
import { PaymentStatus, PaymentMethod } from '@prisma/client';

/**
 * Create Payment DTO
 */
export const createPaymentSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentDate: z.coerce.date().optional(),
  reference: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
});

export type CreatePaymentDTO = z.infer<typeof createPaymentSchema>;

/**
 * Update Payment DTO
 */
export const updatePaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  paymentDate: z.coerce.date().optional(),
  status: z.nativeEnum(PaymentStatus).optional(),
  reference: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
});

export type UpdatePaymentDTO = z.infer<typeof updatePaymentSchema>;

/**
 * List Payments Query DTO
 */
export const listPaymentsSchema = z.object({
  bookingId: z.string().min(1).optional(),
  status: z.nativeEnum(PaymentStatus).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type ListPaymentsDTO = z.infer<typeof listPaymentsSchema>;

/**
 * Payment ID Param DTO
 */
export const paymentIdSchema = z.object({
  id: z.string().min(1, 'Payment ID is required'),
});

export type PaymentIdDTO = z.infer<typeof paymentIdSchema>;

/**
 * Refund Payment DTO
 */
export const refundPaymentSchema = z.object({
  reason: z.string().min(5, 'Refund reason must be at least 5 characters').max(500).optional(),
});

export type RefundPaymentDTO = z.infer<typeof refundPaymentSchema>;

/**
 * Mark Failed DTO
 */
export const markFailedSchema = z.object({
  reason: z.string().min(5, 'Failure reason must be at least 5 characters').max(500).optional(),
});

export type MarkFailedDTO = z.infer<typeof markFailedSchema>;
