import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemoriesModule } from './memories/memories.module';

@Module({
  imports: [MemoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
