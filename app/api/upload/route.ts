import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

import { authOptions } from '@/lib/auth';
import { s3Client, BUCKET_NAME } from '@/lib/s3';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'properties';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Only JPEG, PNG, WebP, GIF, and PDF files are allowed.',
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    // Generate unique filename and S3 key
    const ext = file.name.split('.').pop();
    const filename = `${randomUUID()}.${ext}`;
    const s3Key = `${session.user.id}/${folder}/${filename}`;

    // Generate secure access token
    const accessToken = randomUUID();

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        userId: session.user.id,
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(uploadCommand);

    // Save file metadata to database
    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        userId: session.user.id,
        fileName: filename,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        folder: folder,
        s3Key: s3Key,
        s3Bucket: BUCKET_NAME,
        s3Region: process.env.AWS_REGION || 'us-east-1',
        accessToken: accessToken,
        isPublic: false,
      },
    });

    // Return secure URL with access token
    const url = `/api/files/${accessToken}`;

    return NextResponse.json({
      url,
      filename,
      fileId: uploadedFile.id,
      size: file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
