import { Shop } from '@prisma/client';

export class ShopListDto {
  count: number;
  items: Shop[];

  constructor(items: Shop[]) {
    this.count = items.length;
    this.items = items;
  }
}
