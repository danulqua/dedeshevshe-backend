import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  NotFoundException,
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
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../auth/decorators/user.decorator';
import { Authenticated } from '../auth/guards/authenticated.guard';
import { ImageDTO } from '../file/dto/file.dto';
import { FileService } from '../file/file.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { FindProductFiltersDTO } from './dto/find-product-filters.dto';
import { ImageUploadDTO } from './dto/image-upload.dto';
import { PriceHistoryDTO } from './dto/price-history.dto';
import { GlobalProductListDTO, ProductListDTO } from './dto/product-list.dto';
import { ProductDTO } from './dto/product.dto';
import { ReportOption, ReportOptionDTO } from './dto/report-option.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@ApiException(() => InternalServerErrorException)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService, private fileService: FileService) {}

  @ApiOperation({ summary: 'Find all products' })
  @Get('all')
  async find(@Query() filtersDTO: FindProductFiltersDTO) {
    const { products, totalCount, totalPages } = await this.productService.find(filtersDTO);

    return new ProductListDTO({ items: products, totalCount, totalPages });
  }

  @ApiOperation({
    summary: 'Find all products globally - from database and from Zakaz API',
  })
  @ApiException(() => new BadRequestException('Product title is required'))
  @ApiException(() => new BadRequestException('Shop with this id does not exist'))
  @Get('global')
  async findGlobally(@Query() filtersDTO: FindProductFiltersDTO) {
    const { products, totalCount, totalPages } = await this.productService.findGlobally(filtersDTO);

    return new GlobalProductListDTO({
      items: products,
      totalCount,
      totalPages,
    });
  }

  @ApiOperation({ summary: 'Find one product' })
  @ApiException(() => new NotFoundException('Product with this id does not exist'))
  @Get(':productId')
  async findOne(@Param('productId', ParseIntPipe) productId: number) {
    const product = await this.productService.findOne(productId);
    return new ProductDTO(product);
  }

  @ApiOperation({ summary: 'Add new product' })
  @ApiException(() => new BadRequestException('Provided file does not exist'))
  @ApiException(() => new BadRequestException('Shop with this id does not exist'))
  @ApiException(() => new BadRequestException('User with this id does not exist'))
  @ApiException(() => ForbiddenException)
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() productDTO: CreateProductDTO, @User() user) {
    const product = await this.productService.create(user.id, productDTO);
    return new ProductDTO(product);
  }

  @ApiOperation({ summary: 'Create request for adding new product' })
  @ApiException(() => new BadRequestException('Provided file does not exist'))
  @ApiException(() => new BadRequestException('Shop with this id does not exist'))
  @ApiException(() => new BadRequestException('User with this id does not exist'))
  @ApiException(() => ForbiddenException)
  @UseGuards(Authenticated)
  @Post('request')
  async createRequest(@Body() productDTO: CreateProductDTO, @User() user) {
    const product = await this.productService.create(user.id, {
      ...productDTO,
      status: 'IN_REVIEW',
    });
    return new ProductDTO(product);
  }

  @ApiOperation({ summary: 'Get all my pending requests' })
  @ApiException(() => ForbiddenException)
  @UseGuards(Authenticated)
  @Get('request/my')
  async findMyRequests(@User() user) {
    const { products, totalCount, totalPages } = await this.productService.find({
      userId: user.id,
      status: 'IN_REVIEW',
    });

    return new ProductListDTO({ items: products, totalCount, totalPages });
  }

  @ApiOperation({ summary: 'Update product' })
  @ApiException(() => new BadRequestException('Product with this id does not exist'))
  @ApiException(() => new BadRequestException('Provided file does not exist'))
  @ApiException(() => new BadRequestException('Shop with this id does not exist'))
  @ApiException(() => new BadRequestException('User with this id does not exist'))
  @ApiException(() => ForbiddenException)
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Patch(':productId')
  async update(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() productDTO: UpdateProductDTO,
  ) {
    const product = await this.productService.update(productId, productDTO);
    return new ProductDTO(product);
  }

  @ApiOperation({ summary: 'Delete product' })
  @ApiException(() => new BadRequestException('Product with this id does not exist'))
  @ApiException(() => ForbiddenException)
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Delete(':productId')
  async delete(@Param('productId', ParseIntPipe) productId: number) {
    const product = await this.productService.delete(productId);
    return new ProductDTO(product);
  }

  @ApiOperation({ summary: 'Upload product image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Product image', type: ImageUploadDTO })
  @ApiException(
    () =>
      new BadRequestException('Validation failed (expected type is /image\\/(jpeg)|(png)|(svg)/)'),
  )
  @ApiException(() => ForbiddenException)
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

  @ApiOperation({ summary: "Get product's price history report" })
  @ApiException(() => new BadRequestException('Product with this id does not exist'))
  @ApiException(() => ForbiddenException)
  @ApiQuery({ name: 'option', enum: ReportOption })
  @ApiException(() => ForbiddenException)
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Get(':productId/priceHistory')
  async getPriceHistoryReport(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() { option }: ReportOptionDTO,
  ) {
    const report = await this.productService.getPriceHistoryReport(productId, option);
    return new PriceHistoryDTO(report);
  }
}
