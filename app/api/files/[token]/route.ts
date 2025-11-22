import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { GetObjectCommand } from '@aws-sdk/client-s3';

import { authOptions } from '@/lib/auth';
import { s3Client } from '@/lib/s3';
import prisma from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Get file metadata from database
    const uploadedFile = await prisma.uploadedFile.findUnique({
      where: {
        accessToken: token,
        deletedAt: null, // Only non-deleted files
      },
    });

    if (!uploadedFile) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Check if file is public or if user owns the file
    if (!uploadedFile.isPublic) {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Verify ownership
      if (uploadedFile.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Get file from S3
    const getCommand = new GetObjectCommand({
      Bucket: uploadedFile.s3Bucket,
      Key: uploadedFile.s3Key,
    });

    const s3Response = await s3Client.send(getCommand);

    if (!s3Response.Body) {
      return NextResponse.json({ error: 'File content not found' }, { status: 404 });
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of s3Response.Body as any) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Update access count and last accessed time
    await prisma.uploadedFile.update({
      where: { id: uploadedFile.id },
      data: {
        accessCount: { increment: 1 },
        lastAccessedAt: new Date(),
      },
    });

    // Return file with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': uploadedFile.mimeType,
        'Content-Length': uploadedFile.fileSize.toString(),
        'Content-Disposition': `inline; filename="${uploadedFile.originalName}"`,
        'Cache-Control': 'private, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('File access error:', error);
    return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
  }
}

// DELETE endpoint for file deletion
export async function DELETE(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await params;

    // Get file metadata
    const uploadedFile = await prisma.uploadedFile.findUnique({
      where: {
        accessToken: token,
        deletedAt: null,
      },
    });

    if (!uploadedFile) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Verify ownership
    if (uploadedFile.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Soft delete (mark as deleted instead of actually deleting)
    await prisma.uploadedFile.update({
      where: { id: uploadedFile.id },
      data: { deletedAt: new Date() },
    });

    // Note: We're doing soft delete here. For hard delete, you would also:
    // const deleteCommand = new DeleteObjectCommand({
    //   Bucket: uploadedFile.s3Bucket,
    //   Key: uploadedFile.s3Key,
    // });
    // await s3Client.send(deleteCommand);

    return NextResponse.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
