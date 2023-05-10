import { PartialType } from '@nestjs/mapped-types';
import { CreateShopDto } from 'src/shop/dto/create-shop.dto';

export class UpdateShopDto extends PartialType(CreateShopDto) {}
