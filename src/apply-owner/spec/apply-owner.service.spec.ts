import { Test, TestingModule } from '@nestjs/testing';
import { ApplyOwnerService } from '../apply-owner.service';

describe('ApplyOwnerService', () => {
  let service: ApplyOwnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplyOwnerService],
    }).compile();

    service = module.get<ApplyOwnerService>(ApplyOwnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
