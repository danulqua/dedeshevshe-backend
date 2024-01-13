import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShopDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNumber()
  imageId?: number;

  @IsOptional()
  @IsBoolean()
  isExternal?: boolean;

  @IsOptional()
  @IsString()
  externalId?: string;
}
