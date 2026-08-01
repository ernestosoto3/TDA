import { Body, Controller, INestApplication, Post } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IsString } from 'class-validator';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/configure-app';
import { DatabaseService } from '../src/database/database.service';

class ValidationTestDto {
  @IsString()
  name!: string;
}

@Controller('validation-test')
class ValidationTestController {
  @Post()
  validate(@Body() body: ValidationTestDto): ValidationTestDto {
    return body;
  }
}

function expectPayloadTooLargeResponse(response: request.Response): void {
  expect(response.headers['x-request-id']).toMatch(/^req_[a-f0-9]{32}$/);

  expect(response.body).toEqual({
    error: {
      code: 'PAYLOAD_TOO_LARGE',
      message: 'The request payload is too large.',
      requestId: response.headers['x-request-id'],
    },
  });
}

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [ValidationTestController],
    })
      .overrideProvider(DatabaseService)
      .useValue({
        onModuleInit: jest.fn(),
        onApplicationShutdown: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('/api/v1 (GET)', () => {
    return request(app.getHttpServer()).get('/api/v1').expect(200).expect('Hello World!');
  });

  it('/api/v1 (GET) applies the non-production security headers', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1').expect(200);

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers['strict-transport-security']).toBeUndefined();
  });

  it('/api/v1/validation-test (POST) returns the standardized validation error', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/validation-test')
      .send({
        name: 123,
      })
      .expect(400);

    expect(response.headers['x-request-id']).toMatch(/^req_[a-f0-9]{32}$/);
    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'The request contains invalid fields.',
        details: [
          {
            field: 'name',
            issue: 'name must be a string',
          },
        ],
        requestId: response.headers['x-request-id'],
      },
    });
  });
  it('/api/v1/validation-test (POST) rejects an oversized JSON body', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/validation-test')
      .send({
        name: 'a'.repeat(1_100_000),
      })
      .expect(413);

    expectPayloadTooLargeResponse(response);
  });

  it('/api/v1/validation-test (POST) rejects an oversized URL-encoded body', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/validation-test')
      .type('form')
      .send({
        name: 'a'.repeat(1_100_000),
      })
      .expect(413);

    expectPayloadTooLargeResponse(response);
  });

  afterEach(async () => {
    await app?.close();
  });
});
