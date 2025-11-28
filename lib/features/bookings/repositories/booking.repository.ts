import { Prisma, Booking, BookingStatus } from '@prisma/client';
import { prisma } from '@/lib/db';

/**
 * Booking Repository
 * Handles all database operations for bookings
 * Abstracts Prisma queries from business logic
 */
export class BookingRepository {
  /**
   * Find booking by ID
   */
  async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            primaryImageUrl: true,
          },
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            paymentDate: true,
            status: true,
            paymentMethod: true,
          },
        },
      },
    });
  }

  /**
   * Find all bookings for a user/organization
   */
  async findByUserId(
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
    const where: Prisma.BookingWhereInput = {
      userId,
    };

    if (filters?.propertyId) {
      where.propertyId = filters.propertyId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.source) {
      where.bookingSource = filters.source as Booking['bookingSource'];
    }

    if (filters?.startDate || filters?.endDate) {
      where.checkInDate = {};
      if (filters.startDate) {
        where.checkInDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.checkInDate.lte = filters.endDate;
      }
    }

    if (filters?.search) {
      where.OR = [
        { guestName: { contains: filters.search, mode: 'insensitive' } },
        { guestEmail: { contains: filters.search, mode: 'insensitive' } },
        { guestPhone: { contains: filters.search, mode: 'insensitive' } },
        { bookingReference: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return prisma.booking.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            primaryImageUrl: true,
          },
        },
      },
      orderBy: { checkInDate: 'desc' },
    });
  }

  /**
   * Find bookings for a specific property
   */
  async findByProperty(propertyId: string) {
    return prisma.booking.findMany({
      where: { propertyId },
      include: {
        property: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { checkInDate: 'desc' },
    });
  }

  /**
   * Find overlapping bookings for availability checking
   * This is the most critical query for preventing double-bookings
   */
  async findOverlapping(
    propertyId: string,
    checkIn: Date,
    checkOut: Date,
    excludeBookingId?: string
  ): Promise<Booking[]> {
    return prisma.booking.findMany({
      where: {
        propertyId,
        ...(excludeBookingId && { id: { not: excludeBookingId } }),
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        OR: [
          {
            // New booking starts during existing booking
            AND: [{ checkInDate: { lte: checkOut } }, { checkOutDate: { gt: checkIn } }],
          },
          {
            // New booking ends during existing booking
            AND: [{ checkInDate: { lt: checkOut } }, { checkOutDate: { gte: checkOut } }],
          },
          {
            // New booking completely contains existing booking
            AND: [{ checkInDate: { gte: checkIn } }, { checkOutDate: { lte: checkOut } }],
          },
        ],
      },
    });
  }

  /**
   * Create a new booking with transaction support
   */
  async create(data: Prisma.BookingCreateInput) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data,
        include: {
          property: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
            },
          },
        },
      });

      // Update property's last booking date
      await tx.property.update({
        where: { id: data.property.connect?.id },
        data: { updatedAt: new Date() },
      });

      return booking;
    });
  }

  /**
   * Update a booking
   */
  async update(id: string, data: Prisma.BookingUpdateInput) {
    return prisma.booking.update({
      where: { id },
      data,
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
          },
        },
      },
    });
  }

  /**
   * Delete a booking
   */
  async delete(id: string) {
    return prisma.booking.delete({
      where: { id },
    });
  }

  /**
   * Update payment status based on payments
   */
  async updatePaymentStatus(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { totalAmount: true },
    });

    if (!booking) {
      return null;
    }

    const totalPaid = await prisma.payment.aggregate({
      where: {
        bookingId,
        status: 'PAID',
      },
      _sum: {
        amount: true,
      },
    });

    const amountPaid = Number(totalPaid._sum.amount || 0);
    const totalAmount = Number(booking.totalAmount);

    return prisma.booking.update({
      where: { id: bookingId },
      data: {
        amountPaid,
        amountDue: totalAmount - amountPaid,
        paymentStatus:
          amountPaid >= totalAmount ? 'PAID' : amountPaid > 0 ? 'PARTIALLY_PAID' : 'PENDING',
      },
    });
  }

  /**
   * Get upcoming check-ins
   */
  async getUpcomingCheckIns(userId: string, days = 7) {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + days);

    return prisma.booking.findMany({
      where: {
        userId,
        checkInDate: {
          gte: today,
          lte: future,
        },
        status: 'CONFIRMED',
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
      orderBy: { checkInDate: 'asc' },
    });
  }

  /**
   * Get upcoming check-outs
   */
  async getUpcomingCheckOuts(userId: string, days = 7) {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + days);

    return prisma.booking.findMany({
      where: {
        userId,
        checkOutDate: {
          gte: today,
          lte: future,
        },
        status: 'CHECKED_IN',
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
      orderBy: { checkOutDate: 'asc' },
    });
  }

  /**
   * Get booking statistics for a user
   */
  async getStatistics(userId: string) {
    const [total, confirmed, checkedIn, completed, cancelled] = await Promise.all([
      prisma.booking.count({ where: { userId } }),
      prisma.booking.count({ where: { userId, status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { userId, status: 'CHECKED_IN' } }),
      prisma.booking.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.booking.count({ where: { userId, status: 'CANCELLED' } }),
    ]);

    return {
      total,
      confirmed,
      checkedIn,
      completed,
      cancelled,
    };
  }
}

// Export singleton instance
export const bookingRepository = new BookingRepository();
