import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { requireSuperAdmin } from '@/lib/auth-helpers';
import prisma from '@/lib/db';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export async function PUT(request: Request) {
  try {
    const session = await requireSuperAdmin();
    const body = await request.json();
    const validatedData = changePasswordSchema.parse(body);

    // Fetch the current user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(validatedData.currentPassword, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);

    // Update the password
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
      },
    });

    // Log the admin action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'updated',
        entity: 'password',
        entityId: session.user.id,
        changes: {
          action: 'password_changed',
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
