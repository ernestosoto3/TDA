import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { R2Status } from './health-response.dto';

@Injectable()
export class R2HealthService {
  constructor(private readonly configService: ConfigService) {}

  async checkHealth(): Promise<R2Status> {
    const accountId = this.configService.get<string>('CLOUDFLARE_R2_ACCOUNT_ID');
    const accessKeyId = this.configService.get<string>('CLOUDFLARE_R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('CLOUDFLARE_R2_SECRET_ACCESS_KEY');
    const bucketName = this.configService.get<string>('CLOUDFLARE_R2_BUCKET_NAME');

    const configuration = [accountId, accessKeyId, secretAccessKey, bucketName];
    const isConfigured = configuration.some((value) => value !== undefined);

    if (!isConfigured) {
      return 'not_configured';
    }

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      return 'down';
    }

    const client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    try {
      await client.send(
        new HeadBucketCommand({
          Bucket: bucketName,
        }),
      );

      return 'up';
    } catch {
      return 'down';
    } finally {
      client.destroy();
    }
  }
}
