import { Controller, Get } from '@nestjs/common';
import { ZakazService } from 'src/zakaz/zakaz.service';

@Controller('zakaz')
export class ZakazController {
  constructor(private zakazService: ZakazService) {}

  @Get('shops')
  getShops() {
    return this.zakazService.getShops();
  }
}
