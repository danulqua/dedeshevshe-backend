import { PartialType } from '@nestjs/swagger';
import { CreateShopDTO } from './create-shop.dto';

export class UpdateShopDTO extends PartialType(CreateShopDTO) {}
