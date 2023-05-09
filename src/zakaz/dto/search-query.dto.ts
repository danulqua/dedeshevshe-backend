import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchQueryDTO {
  @IsString()
  q: string;

  @IsOptional()
  @IsString()
  shopId: string;

  @IsOptional()
  @IsNumber()
  maxPrice: number;

  @IsOptional()
  @IsBoolean()
  discountsOnly: boolean;
}
