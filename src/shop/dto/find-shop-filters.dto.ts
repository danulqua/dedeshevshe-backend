import { Shop } from '@prisma/client';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';

type ShopSortBy = keyof Omit<Shop, 'externalId'>;
const shopSortBy: ShopSortBy[] = [
  'id',
  'title',
  'isExternal',
  'createdAt',
  'updatedAt',
];

export class FindShopFiltersDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Matches(/^(internal|external)$/i, {
    message: 'source must be internal or external',
  })
  source?: 'internal' | 'external';

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @Matches(/^(id|title|isExternal|createdAt|updatedAt)$/i, {
    message: `sortBy must be ${shopSortBy.join(', ')}`,
  })
  sortBy?: ShopSortBy;

  @IsOptional()
  @Matches(/^(asc|desc)$/i, { message: 'order must be asc or desc' })
  order?: 'asc' | 'desc';
}
