import { Test, TestingModule } from '@nestjs/testing';
import { GoogleapiController } from '../googleapi.controller';

describe('GoogleapiController', () => {
  let controller: GoogleapiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleapiController],
    }).compile();

    controller = module.get<GoogleapiController>(GoogleapiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
