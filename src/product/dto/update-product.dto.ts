import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDTO } from 'src/product/dto/create-product.dto';

export class UpdateProductDTO extends PartialType(CreateProductDTO) {}
