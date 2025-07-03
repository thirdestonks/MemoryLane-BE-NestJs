import { Test, TestingModule } from '@nestjs/testing';
import { MemoriesController } from './memories.controller';
import { MemoriesService } from './memories.service';

describe('MemoriesController', () => {
  let controller: MemoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemoriesController],
      providers: [MemoriesService],
    }).compile();

    controller = module.get<MemoriesController>(MemoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
