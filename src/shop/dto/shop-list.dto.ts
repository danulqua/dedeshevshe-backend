import { Shop } from '@prisma/client';

interface ShopListParams {
  totalCount: number;
  totalPages: number;
  items: Shop[];
}

export class ShopListDTO {
  totalCount: number;
  totalPages: number;
  items: Shop[];

  constructor({ items, totalCount, totalPages }: ShopListParams) {
    this.totalCount = totalCount;
    this.totalPages = totalPages;
    this.items = items;
  }
}
