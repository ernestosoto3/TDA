import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool, type PoolConfig } from 'pg';

function getSslConfiguration(sslMode: string): PoolConfig['ssl'] {
  if (sslMode === 'disable') {
    return false;
  }

  return {
    rejectUnauthorized: true,
  };
}

@Injectable()
export class DatabaseService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly pool: Pool;

  readonly db: NodePgDatabase;

  constructor(private readonly configService: ConfigService) {
    const environment = this.configService.getOrThrow<string>('NODE_ENV');

    const connectionString =
      environment === 'test'
        ? this.configService.getOrThrow<string>('TEST_DATABASE_URL')
        : this.configService.getOrThrow<string>('DATABASE_URL');

    const sslMode = this.configService.getOrThrow<string>('DATABASE_SSL_MODE');

    this.pool = new Pool({
      connectionString,
      ssl: getSslConfiguration(sslMode),
      max: this.configService.getOrThrow<number>('DATABASE_POOL_MAX'),
      connectionTimeoutMillis: this.configService.getOrThrow<number>(
        'DATABASE_CONNECTION_TIMEOUT_MS',
      ),
      idleTimeoutMillis: this.configService.getOrThrow<number>('DATABASE_IDLE_TIMEOUT_MS'),
    });

    this.db = drizzle(this.pool);
  }

  async onApplicationBootstrap(): Promise<void> {
    try {
      const result = await this.pool.query<{
        database_name: string;
      }>('SELECT current_database() AS database_name');

      const databaseName = result.rows[0]?.database_name;

      this.logger.log(`Connected to PostgreSQL database "${databaseName}"`);
    } catch {
      throw new Error(
        'PostgreSQL connection failed. Check the database URL, credentials, PostgreSQL service, and SSL settings.',
      );
    }
  }

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
    this.logger.log('PostgreSQL connection pool closed');
  }
}
