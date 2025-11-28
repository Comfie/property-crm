import { Prisma, PaymentStatus } from '@prisma/client';
import { prisma } from '@/lib/db';

/**
 * Payment Repository
 * Handles all database operations for payments
 */
export class PaymentRepository {
  /**
   * Find payment by ID
   */
  async findById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
          select: {
            id: true,
            bookingReference: true,
            guestName: true,
            property: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Find all payments for a user
   */
  async findByUserId(
    userId: string,
    filters?: {
      bookingId?: string;
      status?: PaymentStatus;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const where: Prisma.PaymentWhereInput = { userId };

    if (filters?.bookingId) {
      where.bookingId = filters.bookingId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      where.paymentDate = {};
      if (filters.startDate) {
        where.paymentDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.paymentDate.lte = filters.endDate;
      }
    }

    return prisma.payment.findMany({
      where,
      include: {
        booking: {
          select: {
            id: true,
            bookingReference: true,
            guestName: true,
            property: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { paymentDate: 'desc' },
    });
  }

  /**
   * Find payments by booking ID
   */
  async findByBookingId(bookingId: string) {
    return prisma.payment.findMany({
      where: { bookingId },
      orderBy: { paymentDate: 'desc' },
    });
  }

  /**
   * Create a new payment
   */
  async create(data: Prisma.PaymentCreateInput) {
    return prisma.payment.create({
      data,
      include: {
        booking: {
          select: {
            id: true,
            bookingReference: true,
            guestName: true,
          },
        },
      },
    });
  }

  /**
   * Update a payment
   */
  async update(id: string, data: Prisma.PaymentUpdateInput) {
    return prisma.payment.update({
      where: { id },
      data,
      include: {
        booking: {
          select: {
            id: true,
            bookingReference: true,
            guestName: true,
          },
        },
      },
    });
  }

  /**
   * Delete a payment
   */
  async delete(id: string) {
    return prisma.payment.delete({
      where: { id },
    });
  }

  /**
   * Get total payments for a booking
   */
  async getTotalPaidForBooking(bookingId: string) {
    const result = await prisma.payment.aggregate({
      where: {
        bookingId,
        status: 'PAID',
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  /**
   * Get payment statistics
   */
  async getStatistics(userId: string) {
    const [totalPayments, paidCount, pendingCount, failedCount] = await Promise.all([
      prisma.payment.aggregate({
        where: { userId, status: 'PAID' },
        _sum: { amount: true },
      }),
      prisma.payment.count({ where: { userId, status: 'PAID' } }),
      prisma.payment.count({ where: { userId, status: 'PENDING' } }),
      prisma.payment.count({ where: { userId, status: 'FAILED' } }),
    ]);

    return {
      totalAmount: Number(totalPayments._sum.amount || 0),
      paidCount,
      pendingCount,
      failedCount,
    };
  }

  /**
   * Get recent payments
   */
  async getRecent(userId: string, limit = 10) {
    return prisma.payment.findMany({
      where: { userId },
      include: {
        booking: {
          select: {
            id: true,
            bookingReference: true,
            guestName: true,
            property: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { paymentDate: 'desc' },
      take: limit,
    });
  }
}

// Export singleton instance
export const paymentRepository = new PaymentRepository();
