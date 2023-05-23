import { PartialType } from '@nestjs/swagger';
import { CreateProductDTO } from 'src/product/dto/create-product.dto';

export class UpdateProductDTO extends PartialType(CreateProductDTO) {}
