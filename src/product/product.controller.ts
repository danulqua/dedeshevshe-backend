import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDTO } from 'src/product/dto/create-product.dto';
import { FindProductFiltersDTO } from 'src/product/dto/find-product-filters.dto';
import { ProductListDTO } from 'src/product/dto/product-list.dto';
import { UpdateProductDTO } from 'src/product/dto/update-product.dto';
import { ProductService } from 'src/product/product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('all')
  async find(@Query() filtersDTO: FindProductFiltersDTO) {
    const { products, totalCount, totalPages } = await this.productService.find(
      filtersDTO,
    );

    return new ProductListDTO({ items: products, totalCount, totalPages });
  }

  @Get('global')
  async findGlobally(@Query() filtersDTO: FindProductFiltersDTO) {
    const { products, totalCount, totalPages } =
      await this.productService.findGlobally(filtersDTO);

    return new ProductListDTO({ items: products, totalCount, totalPages });
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
