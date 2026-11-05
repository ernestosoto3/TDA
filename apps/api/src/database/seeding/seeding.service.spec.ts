import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database.service';
import { SeedingService } from './seeding.service';

describe('SeedingService', () => {
  let service: SeedingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedingService,
        {
          provide: DatabaseService,
          useValue: { db: {} },
        },
      ],
    }).compile();

    service = module.get<SeedingService>(SeedingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
