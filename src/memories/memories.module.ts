import { Module } from '@nestjs/common';
import { MemoriesService } from './memories.service';
import { MemoriesController } from './memories.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [MemoriesController],
  providers: [MemoriesService, PrismaService],
})
export class MemoriesModule {}
