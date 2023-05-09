import { Test, TestingModule } from '@nestjs/testing';
import { ZakazService } from './zakaz.service';

describe('ZakazService', () => {
  let service: ZakazService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZakazService],
    }).compile();

    service = module.get<ZakazService>(ZakazService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
