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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageDTO } from 'src/file/dto/file.dto';
import { FileService } from 'src/file/file.service';
import { CreateProductDTO } from 'src/product/dto/create-product.dto';
import { FindProductFiltersDTO } from 'src/product/dto/find-product-filters.dto';
import { ProductListDTO } from 'src/product/dto/product-list.dto';
import { UpdateProductDTO } from 'src/product/dto/update-product.dto';
import { ProductService } from 'src/product/product.service';

@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private fileService: FileService,
  ) {}

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

  @UseInterceptors(FileInterceptor('file'))
  @Post('image/upload')
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    const logo = await this.fileService.createFile(file, 'jpg');
    return new ImageDTO(logo);
  }
}
