import { Module } from '@nestjs/common';
import { MemoriesService } from './memories.service';
import { MemoriesController } from './memories.controller';

@Module({
  controllers: [MemoriesController],
  providers: [MemoriesService],
})
export class MemoriesModule {}
