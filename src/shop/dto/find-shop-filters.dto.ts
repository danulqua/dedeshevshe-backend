import { Shop } from '@prisma/client';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

type ShopSortBy = keyof Omit<Shop, 'externalId'>;

export class FindShopFiltersDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  isExternal?: boolean;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @Matches(/^(id|title|isExternal|createdAt|updatedAt)$/i)
  sortBy?: ShopSortBy;

  @IsOptional()
  @Matches(/^(asc|desc)$/i)
  order?: 'asc' | 'desc';
}
