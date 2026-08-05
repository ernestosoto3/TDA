import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { LivenessResponseDto, ReadinessResponseDto } from './health-response.dto';
import { HealthService } from './health.service';

@ApiTags('Operational health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  @ApiOperation({
    summary: 'Check API liveness',
    description:
      'Confirms that the API process is running. It does not check external dependencies.',
  })
  @ApiOkResponse({
    description: 'The API process is running.',
    type: LivenessResponseDto,
  })
  checkLiveness(): LivenessResponseDto {
    return {
      status: 'ok',
      service: 'tda-api',
    };
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Check API readiness',
    description: 'Checks PostgreSQL and checks Cloudflare R2 only when R2 is configured.',
  })
  @ApiOkResponse({
    description: 'All required dependencies are available.',
    type: ReadinessResponseDto,
  })
  @ApiServiceUnavailableResponse({
    description: 'A required or configured dependency is unavailable.',
    type: ReadinessResponseDto,
  })
  async checkReadiness(
    @Res({ passthrough: true }) response: Response,
  ): Promise<ReadinessResponseDto> {
    const readiness = await this.healthService.checkReadiness();

    if (readiness.status === 'error') {
      response.status(HttpStatus.SERVICE_UNAVAILABLE);
    }

    return readiness;
  }
}
