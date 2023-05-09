import { Test, TestingModule } from '@nestjs/testing';
import { ZakazController } from './zakaz.controller';

describe('ZakazController', () => {
  let controller: ZakazController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZakazController],
    }).compile();

    controller = module.get<ZakazController>(ZakazController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
