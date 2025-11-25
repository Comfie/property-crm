import { S3Client } from '@aws-sdk/client-s3';
import { env } from '@/lib/config/env';

// S3 Configuration - Uses validated environment variables
const S3_CONFIG = {
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
};

const BUCKET_NAME = env.AWS_S3_BUCKET;

// Create S3 client
const s3Client = new S3Client(S3_CONFIG);

export { s3Client, BUCKET_NAME };
