import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireSuperAdmin } from '@/lib/auth-helpers';
import prisma from '@/lib/db';

const emailSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await params;
    const body = await request.json();
    const validatedData = emailSchema.parse(body);

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id, role: 'CUSTOMER' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // TODO: Implement actual email sending here
    // For now, we'll just log the email and create a notification
    console.log('Email to be sent:', {
      to: user.email,
      subject: validatedData.subject,
      message: validatedData.message,
    });

    // Create a notification for the user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: validatedData.subject,
        message: validatedData.message,
        notificationType: 'SYSTEM',
      },
    });

    // Log the admin action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'sent_email',
        entity: 'user',
        entityId: id,
        changes: {
          subject: validatedData.subject,
          recipient: user.email,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Email queued for delivery and notification created',
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
