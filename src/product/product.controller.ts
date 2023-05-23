import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { Authenticated } from 'src/auth/guards/authenticated.guard';
import { ImageDTO } from 'src/file/dto/file.dto';
import { FileService } from 'src/file/file.service';
import { CreateProductDTO } from 'src/product/dto/create-product.dto';
import { FindProductFiltersDTO } from 'src/product/dto/find-product-filters.dto';
import { ProductListDTO } from 'src/product/dto/product-list.dto';
import { ReportOptionDTO } from 'src/product/dto/report-option.dto';
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

  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
  @Patch(':productId')
  update(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() productDTO: UpdateProductDTO,
  ) {
    return this.productService.update(productId, productDTO);
  }

  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Delete(':productId')
  delete(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.delete(productId);
  }

  @UseGuards(Authenticated)
  @UseInterceptors(FileInterceptor('file'))
  @Post('image/upload')
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 2 mb max file size
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          // only jpeg and png images
          new FileTypeValidator({ fileType: /image\/(jpeg)|(png)|(svg)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const image = await this.fileService.uploadFile(file);
    return new ImageDTO(image);
  }

  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Get(':productId/priceHistory')
  getPriceHistoryReport(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() { option }: ReportOptionDTO,
  ) {
    return this.productService.getPriceHistoryReport(productId, option);
  }
}
