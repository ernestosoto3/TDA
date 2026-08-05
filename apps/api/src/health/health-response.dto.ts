import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type DependencyStatus = 'up' | 'down';
export type R2Status = DependencyStatus | 'not_configured';

export class LivenessResponseDto {
  @ApiProperty({
    enum: ['ok'],
    example: 'ok',
  })
  status!: 'ok';

  @ApiProperty({
    enum: ['tda-api'],
    example: 'tda-api',
  })
  service!: 'tda-api';
}

export class ReadinessChecksDto {
  @ApiProperty({
    enum: ['up', 'down'],
    example: 'up',
    description: 'PostgreSQL connectivity status.',
  })
  postgresql!: DependencyStatus;

  @ApiPropertyOptional({
    enum: ['up', 'down'],
    example: 'up',
    description: 'Cloudflare R2 connectivity status. Omitted when R2 is not configured.',
  })
  r2?: DependencyStatus;
}

export class ReadinessResponseDto {
  @ApiProperty({
    enum: ['ok', 'error'],
    example: 'ok',
  })
  status!: 'ok' | 'error';

  @ApiProperty({
    enum: ['tda-api'],
    example: 'tda-api',
  })
  service!: 'tda-api';

  @ApiProperty({
    type: ReadinessChecksDto,
  })
  checks!: ReadinessChecksDto;
}
