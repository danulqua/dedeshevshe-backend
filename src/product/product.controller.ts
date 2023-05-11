import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductDTO } from 'src/product/dto/create-product.dto';
import { ProductListDTO } from 'src/product/dto/product-list.dto';
import { UpdateProductDTO } from 'src/product/dto/update-product.dto';
import { ProductService } from 'src/product/product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('all')
  async find() {
    const products = await this.productService.find();
    return new ProductListDTO(products);
  }

  @Get(':productId')
  findOne(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.findOne(productId);
  }

  @Post()
  create(@Body() productDto: CreateProductDTO) {
    return this.productService.create(productDto);
  }

  @Patch(':productId')
  update(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() productDto: UpdateProductDTO,
  ) {
    return this.productService.update(productId, productDto);
  }

  @Delete(':productId')
  delete(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.delete(productId);
  }
}
