import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { SeedingService } from './seeding/seeding.service';

@Global()
@Module({
  providers: [DatabaseService, SeedingService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
