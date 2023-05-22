import { Product } from '@prisma/client';
import { ProductZakazWithShop } from 'src/zakaz/types';

interface ProductListParams {
  totalCount: number;
  totalPages: number;
  items: (Product | ProductZakazWithShop)[];
}

export class ProductListDTO {
  totalCount: number;
  totalPages: number;
  items: (Product | ProductZakazWithShop)[];

  constructor({ items, totalCount, totalPages }: ProductListParams) {
    this.totalCount = totalCount;
    this.totalPages = totalPages;
    this.items = items;
  }
}
