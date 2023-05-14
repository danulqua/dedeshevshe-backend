import { Product } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

type ProductSortBy = keyof Omit<Product, 'url' | 'isExternal' | 'imageId'>;
const productSortBy: ProductSortBy[] = [
  'id',
  'title',
  'description',
  'price',
  'discount',
  'oldPrice',
  'volume',
  'weight',
  'status',
  'createdAt',
  'updatedAt',
  'userId',
  'shopId',
];

export class FindProductFiltersDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  shopId?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsBoolean()
  discountsOnly?: boolean;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @Matches(
    /^("id"|"title"|"description"|"price"|"discount"|"oldPrice"|"volume"|"weight"|"status"|"createdAt"|"updatedAt"|"userId"|"shopId")$/i,
    {
      message: `sortBy must be ${productSortBy.join(', ')}`,
    },
  )
  sortBy?: ProductSortBy;

  @IsOptional()
  @Matches(/^(asc|desc)$/i, { message: 'order must be asc or desc' })
  order?: 'asc' | 'desc';
}
