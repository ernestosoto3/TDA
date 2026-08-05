import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { configureApp } from '../src/configure-app';
import { createOpenApiDocument } from '../src/openapi/openapi.config';
import { createRequire } from 'node:module';
import type { Type } from '@nestjs/common';
import { format, resolveConfig } from 'prettier';

const outputPath = resolve(__dirname, '../openapi.json');

const requireModule = createRequire(__filename);

function configureGenerationEnvironment(): void {
  process.env.NODE_ENV = 'test';
  process.env.API_PORT = '3000';
  process.env.DATABASE_URL = 'postgresql://openapi:openapi@localhost:5432/tda_openapi';
  process.env.TEST_DATABASE_URL = 'postgresql://openapi:openapi@localhost:5432/tda_openapi_test';
  process.env.DATABASE_SSL_MODE = 'disable';

  delete process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  delete process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  delete process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  delete process.env.CLOUDFLARE_R2_BUCKET_NAME;
}

function sortRecursively(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortRecursively);
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nestedValue]) => [key, sortRecursively(nestedValue)]),
    );
  }

  return value;
}

async function generateDocument(): Promise<string> {
  configureGenerationEnvironment();

  const { AppModule } = requireModule('../src/app.module') as {
    AppModule: Type<unknown>;
  };

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: false,
  });

  try {
    configureApp(app);

    const document = createOpenApiDocument(app);
    const deterministicDocument = sortRecursively(document);

    const prettierConfig = await resolveConfig(outputPath);

    return format(JSON.stringify(deterministicDocument), {
      ...(prettierConfig ?? {}),
      filepath: outputPath,
      parser: 'json',
    });
  } finally {
    await app.close();
  }
}

async function validateDocument(): Promise<void> {
  const firstGeneration = await generateDocument();
  const secondGeneration = await generateDocument();

  if (firstGeneration !== secondGeneration) {
    throw new Error('OpenAPI generation is not deterministic: repeated generations differ.');
  }

  let committedDocument: string;

  try {
    committedDocument = await readFile(outputPath, 'utf8');
  } catch {
    throw new Error('apps/api/openapi.json does not exist. Run pnpm openapi:generate.');
  }

  if (committedDocument !== firstGeneration) {
    throw new Error('apps/api/openapi.json is outdated. Run pnpm openapi:generate.');
  }

  const parsedDocument = JSON.parse(committedDocument) as {
    openapi?: unknown;
    info?: unknown;
    paths?: unknown;
  };

  if (
    typeof parsedDocument.openapi !== 'string' ||
    typeof parsedDocument.info !== 'object' ||
    parsedDocument.info === null ||
    typeof parsedDocument.paths !== 'object' ||
    parsedDocument.paths === null
  ) {
    throw new Error('apps/api/openapi.json is not a valid generated OpenAPI document.');
  }
}

async function main(): Promise<void> {
  if (process.argv.includes('--check')) {
    await validateDocument();
    process.stdout.write('OpenAPI document is valid, current, and deterministic.\n');
    return;
  }

  const document = await generateDocument();

  await writeFile(outputPath, document, 'utf8');
  process.stdout.write('Generated apps/api/openapi.json.\n');
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
