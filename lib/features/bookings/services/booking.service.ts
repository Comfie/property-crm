import { Prisma, BookingStatus } from '@prisma/client';
import { bookingRepository } from '@/lib/features/bookings/repositories/booking.repository';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/shared/logger';
import {
  ValidationError,
  NotFoundError,
  AvailabilityError,
  ForbiddenError,
} from '@/lib/shared/errors/app-error';

/**
 * Booking Service
 * Business logic layer for bookings
 * Orchestrates repository calls, validation, and business rules
 */
export class BookingService {
  /**
   * Check if a property is available for the given dates
   * Returns true if available, false if overlapping bookings exist
   */
  async checkAvailability(
    propertyId: string,
    checkInDate: Date,
    checkOutDate: Date,
    excludeBookingId?: string
  ): Promise<{ available: boolean; conflictingBookings?: any[] }> {
    // Validate dates
    if (checkInDate >= checkOutDate) {
      throw new ValidationError('Check-in date must be before check-out date', {
        checkInDate,
        checkOutDate,
      });
    }

    if (checkInDate < new Date()) {
      throw new ValidationError('Check-in date cannot be in the past', {
        checkInDate,
      });
    }

    const overlappingBookings = await bookingRepository.findOverlapping(
      propertyId,
      checkInDate,
      checkOutDate,
      excludeBookingId
    );

    if (overlappingBookings.length > 0) {
      logger.info('Booking availability check failed - overlapping bookings found', {
        propertyId,
        checkInDate,
        checkOutDate,
        conflictCount: overlappingBookings.length,
      });

      return {
        available: false,
        conflictingBookings: overlappingBookings,
      };
    }

    return { available: true };
  }

  /**
   * Calculate booking pricing and details
   */
  async calculatePricing(
    propertyId: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<{
    nights: number;
    baseAmount: number;
    cleaningFee: number;
    serviceFee: number;
    totalAmount: number;
  }> {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        dailyRate: true,
        cleaningFee: true,
      },
    });

    if (!property) {
      throw new NotFoundError('Property', propertyId);
    }

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights < 1) {
      throw new ValidationError('Booking must be at least 1 night', {
        checkInDate,
        checkOutDate,
        nights,
      });
    }

    const baseAmount = Number(property.dailyRate || 0) * nights;
    const cleaningFee = Number(property.cleaningFee || 0);
    const serviceFee = baseAmount * 0.05; // 5% service fee
    const totalAmount = baseAmount + cleaningFee + serviceFee;

    return {
      nights,
      baseAmount,
      cleaningFee,
      serviceFee,
      totalAmount,
    };
  }

  /**
   * Create a new booking with availability check and validation
   */
  async create(
    userId: string,
    data: {
      propertyId: string;
      tenantId?: string;
      guestName: string;
      guestEmail: string;
      guestPhone?: string;
      checkInDate: Date;
      checkOutDate: Date;
      numberOfGuests: number;
      totalAmount?: number;
      bookingSource?: string;
      bookingReference?: string;
      specialRequests?: string;
    }
  ) {
    // Check availability
    const availability = await this.checkAvailability(
      data.propertyId,
      data.checkInDate,
      data.checkOutDate
    );

    if (!availability.available) {
      throw new AvailabilityError('Property is not available for the selected dates', {
        propertyId: data.propertyId,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        conflictingBookings: availability.conflictingBookings,
      });
    }

    // Calculate pricing if not provided
    let totalAmount = data.totalAmount;
    if (!totalAmount) {
      const pricing = await this.calculatePricing(
        data.propertyId,
        data.checkInDate,
        data.checkOutDate
      );
      totalAmount = pricing.totalAmount;
    }

    // Note: Guest count validation removed as maxGuests field doesn't exist in schema
    // TODO: Add maxGuests field to Property model if needed for validation

    // Calculate nights
    const nights = Math.ceil(
      (data.checkOutDate.getTime() - data.checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Create booking
    const booking = await bookingRepository.create({
      user: { connect: { id: userId } },
      property: { connect: { id: data.propertyId } },
      ...(data.tenantId && { tenant: { connect: { id: data.tenantId } } }),
      bookingReference: data.bookingReference || `BK-${Date.now()}`,
      bookingType: 'SHORT_TERM',
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      numberOfNights: nights,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone || '',
      numberOfGuests: data.numberOfGuests,
      baseRate: totalAmount / nights,
      cleaningFee: 0,
      serviceFee: 0,
      totalAmount,
      amountPaid: 0,
      amountDue: totalAmount,
      paymentStatus: 'PENDING',
      bookingSource: (data.bookingSource as any) || 'DIRECT',
      status: 'CONFIRMED',
      guestNotes: data.specialRequests,
    });

    logger.info('Booking created', {
      bookingId: booking.id,
      propertyId: data.propertyId,
      userId,
      totalAmount,
    });

    // TODO: Send confirmation email to guest
    // TODO: Send notification to property owner
    // TODO: Update calendar sync

    return booking;
  }

  /**
   * Update an existing booking
   */
  async update(
    bookingId: string,
    userId: string,
    data: {
      checkInDate?: Date;
      checkOutDate?: Date;
      numberOfGuests?: number;
      status?: BookingStatus;
      guestName?: string;
      guestEmail?: string;
      guestPhone?: string;
      specialRequests?: string;
    }
  ) {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundError('Booking', bookingId);
    }

    // Verify ownership
    if (booking.userId !== userId) {
      throw new ForbiddenError('You do not have permission to update this booking');
    }

    // If dates are changing, check availability
    if (data.checkInDate || data.checkOutDate) {
      const newCheckIn = data.checkInDate || booking.checkInDate;
      const newCheckOut = data.checkOutDate || booking.checkOutDate;

      const availability = await this.checkAvailability(
        booking.propertyId,
        newCheckIn,
        newCheckOut,
        bookingId // Exclude current booking from overlap check
      );

      if (!availability.available) {
        throw new AvailabilityError('Property is not available for the updated dates', {
          propertyId: booking.propertyId,
          checkInDate: newCheckIn,
          checkOutDate: newCheckOut,
          conflictingBookings: availability.conflictingBookings,
        });
      }

      // Recalculate pricing if dates changed
      const pricing = await this.calculatePricing(booking.propertyId, newCheckIn, newCheckOut);

      data = {
        ...data,
        // Update amounts but preserve payments already made
      };
    }

    // Note: Guest count validation removed as maxGuests field doesn't exist in schema
    // TODO: Add maxGuests field to Property model if needed for validation

    const updated = await bookingRepository.update(bookingId, data);

    logger.info('Booking updated', {
      bookingId,
      userId,
      changes: data,
    });

    // TODO: Send update notification to guest
    // TODO: Update calendar sync

    return updated;
  }

  /**
   * Cancel a booking
   */
  async cancel(bookingId: string, userId: string, reason?: string) {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundError('Booking', bookingId);
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError('You do not have permission to cancel this booking');
    }

    if (booking.status === 'CANCELLED') {
      throw new ValidationError('Booking is already cancelled', {
        bookingId,
        currentStatus: booking.status,
      });
    }

    if (booking.status === 'COMPLETED') {
      throw new ValidationError('Cannot cancel a completed booking', {
        bookingId,
        currentStatus: booking.status,
      });
    }

    const updated = await bookingRepository.update(bookingId, {
      status: 'CANCELLED',
      cancellationReason: reason,
    });

    logger.info('Booking cancelled', {
      bookingId,
      userId,
      reason,
    });

    // TODO: Send cancellation email to guest
    // TODO: Process refund if applicable
    // TODO: Update calendar sync

    return updated;
  }

  /**
   * Check-in a guest
   */
  async checkIn(bookingId: string, userId: string) {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundError('Booking', bookingId);
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError('You do not have permission to check-in this booking');
    }

    if (booking.status !== 'CONFIRMED') {
      throw new ValidationError(`Cannot check-in booking with status: ${booking.status}`, {
        bookingId,
        currentStatus: booking.status,
      });
    }

    const updated = await bookingRepository.update(bookingId, {
      status: 'CHECKED_IN',
    });

    logger.info('Guest checked in', {
      bookingId,
      userId,
    });

    return updated;
  }

  /**
   * Check-out a guest
   */
  async checkOut(bookingId: string, userId: string) {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundError('Booking', bookingId);
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError('You do not have permission to check-out this booking');
    }

    if (booking.status !== 'CHECKED_IN') {
      throw new ValidationError(`Cannot check-out booking with status: ${booking.status}`, {
        bookingId,
        currentStatus: booking.status,
      });
    }

    const updated = await bookingRepository.update(bookingId, {
      status: 'COMPLETED',
    });

    logger.info('Guest checked out', {
      bookingId,
      userId,
    });

    return updated;
  }

  /**
   * Get booking by ID with ownership verification
   */
  async getById(bookingId: string, userId: string) {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundError('Booking', bookingId);
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError('You do not have permission to view this booking');
    }

    return booking;
  }

  /**
   * List bookings with filters
   */
  async list(
    userId: string,
    filters?: {
      propertyId?: string;
      status?: BookingStatus;
      source?: string;
      startDate?: Date;
      endDate?: Date;
      search?: string;
    }
  ) {
    return bookingRepository.findByUserId(userId, filters);
  }

  /**
   * Get upcoming check-ins
   */
  async getUpcomingCheckIns(userId: string, days = 7) {
    return bookingRepository.getUpcomingCheckIns(userId, days);
  }

  /**
   * Get upcoming check-outs
   */
  async getUpcomingCheckOuts(userId: string, days = 7) {
    return bookingRepository.getUpcomingCheckOuts(userId, days);
  }

  /**
   * Get booking statistics
   */
  async getStatistics(userId: string) {
    return bookingRepository.getStatistics(userId);
  }

  /**
   * Update payment status after payment is made
   */
  async updatePaymentStatus(bookingId: string, userId: string) {
    const booking = await this.getById(bookingId, userId);
    return bookingRepository.updatePaymentStatus(bookingId);
  }
}

// Export singleton instance
export const bookingService = new BookingService();
