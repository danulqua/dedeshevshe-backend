import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Product } from '@prisma/client';
import { ProductDTO, ProductFromZakazDTO } from 'src/product/dto/product.dto';
import { ProductZakazWithShop } from 'src/zakaz/types';

interface ProductListParams {
  totalCount: number;
  totalPages: number;
  items: Product[];
}

interface GlobalProductListParams {
  totalCount: number;
  totalPages: number;
  items: (Product | ProductZakazWithShop)[];
}

export class ProductListDTO {
  totalCount: number;
  totalPages: number;
  @ApiProperty({ type: [ProductDTO] })
  items: Product[];

  constructor({ items, totalCount, totalPages }: ProductListParams) {
    this.totalCount = totalCount;
    this.totalPages = totalPages;
    this.items = items;
  }
}

export class GlobalProductListDTO {
  totalCount: number;
  totalPages: number;
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [{ $ref: getSchemaPath(ProductDTO) }, { $ref: getSchemaPath(ProductFromZakazDTO) }],
    },
  })
  items: (Product | ProductZakazWithShop)[];

  constructor({ items, totalCount, totalPages }: GlobalProductListParams) {
    this.totalCount = totalCount;
    this.totalPages = totalPages;
    this.items = items;
  }
}
