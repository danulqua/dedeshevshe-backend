import { Product } from '@prisma/client';

export class ProductListDTO {
  count: number;
  items: Product[];

  constructor(items: Product[]) {
    this.count = items.length;
    this.items = items;
  }
}
