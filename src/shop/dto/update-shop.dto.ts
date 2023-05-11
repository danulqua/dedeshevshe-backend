import { PartialType } from '@nestjs/mapped-types';
import { CreateShopDTO } from 'src/shop/dto/create-shop.dto';

export class UpdateShopDTO extends PartialType(CreateShopDTO) {}
