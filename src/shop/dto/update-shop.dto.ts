import { PartialType } from '@nestjs/swagger';
import { CreateShopDTO } from 'src/shop/dto/create-shop.dto';

export class UpdateShopDTO extends PartialType(CreateShopDTO) {}
