import { Product } from '@prisma/client';
import { ProductZakaz } from 'src/zakaz/types';

interface ProductListParams {
  totalCount: number;
  totalPages: number;
  items: (Product | ProductZakaz)[];
}

export class ProductListDTO {
  totalCount: number;
  totalPages: number;
  items: (Product | ProductZakaz)[];

  constructor({ items, totalCount, totalPages }: ProductListParams) {
    this.totalCount = totalCount;
    this.totalPages = totalPages;
    this.items = items;
  }
}
