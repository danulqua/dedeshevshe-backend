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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/decorators/user.decorator';
import { Authenticated } from 'src/auth/guards/authenticated.guard';
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

  @UseGuards(Authenticated)
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

  @UseGuards(Authenticated)
  @Post()
  create(@Body() productDTO: CreateProductDTO, @User() user) {
    return this.productService.create(user.id, productDTO);
  }

  @UseGuards(Authenticated)
  @Post('request')
  createRequest(@Body() productDTO: CreateProductDTO, @User() user) {
    return this.productService.create(user.id, {
      ...productDTO,
      status: 'IN_REVIEW',
    });
  }

  @UseGuards(Authenticated)
  @Get('request/my')
  async findMyRequests(@User() user) {
    const { products, totalCount, totalPages } = await this.productService.find(
      {
        userId: user.id,
        status: 'IN_REVIEW',
      },
    );

    return new ProductListDTO({ items: products, totalCount, totalPages });
  }

  @UseGuards(Authenticated)
  @Patch(':productId')
  update(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() productDTO: UpdateProductDTO,
  ) {
    return this.productService.update(productId, productDTO);
  }

  @UseGuards(Authenticated)
  @Delete(':productId')
  delete(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.delete(productId);
  }

  @UseGuards(Authenticated)
  @UseInterceptors(FileInterceptor('file'))
  @Post('image/upload')
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    const logo = await this.fileService.createFile(file, 'jpg');
    return new ImageDTO(logo);
  }
}
