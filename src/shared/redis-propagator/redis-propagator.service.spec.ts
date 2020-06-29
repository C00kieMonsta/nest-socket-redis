import { Test, TestingModule } from '@nestjs/testing';
import { RedisPropagatorService } from './redis-propagator.service';

describe('RedisPropagatorService', () => {
  let service: RedisPropagatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisPropagatorService],
    }).compile();

    service = module.get<RedisPropagatorService>(RedisPropagatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
