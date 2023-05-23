import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsNullable } from 'src/utils/validators/is-nullable';

class Discount {
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  oldPrice: number;
}

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNullable()
  @IsString()
  description: string | null;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  price: number;

  @IsNullable()
  @ValidateNested()
  @Type(() => Discount)
  discount: Discount | null;

  @IsNullable()
  @IsNumber()
  volume: number | null;

  @IsNullable()
  @IsNumber()
  weight: number | null;

  @ApiProperty({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsNumber()
  @IsNotEmpty()
  shopId: number;

  @IsNullable()
  @IsNumber()
  imageId: number | null;
}
