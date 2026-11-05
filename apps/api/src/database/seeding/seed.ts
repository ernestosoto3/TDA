import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SeedingService } from './seeding.service';

async function createContext() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedingService);
  await seedService.seeding();
  await app.close();
}

void createContext();
