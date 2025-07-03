import { Test, TestingModule } from '@nestjs/testing';
import { MemoriesService } from './memories.service';

describe('MemoriesService', () => {
  let service: MemoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemoriesService],
    }).compile();

    service = module.get<MemoriesService>(MemoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
