import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShopDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
}
