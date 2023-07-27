import { ApiProperty } from '@nestjs/swagger';
import { Shop } from '@prisma/client';
import { ShopDTO } from './shop.dto';
interface ShopListParams {
  totalCount: number;
  totalPages: number;
  items: Shop[];
}

export class ShopListDTO {
  totalCount: number;
  totalPages: number;

  @ApiProperty({ type: [ShopDTO] })
  items: Shop[];

  constructor({ items, totalCount, totalPages }: ShopListParams) {
    this.totalCount = totalCount;
    this.totalPages = totalPages;
    this.items = items;
  }
}
