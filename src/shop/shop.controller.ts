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
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { Authenticated } from '../auth/guards/authenticated.guard';
import { ImageDTO } from '../file/dto/file.dto';
import { FileService } from '../file/file.service';
import { CreateShopDTO } from './dto/create-shop.dto';
import { FindShopFiltersDTO } from './dto/find-shop-filters.dto';
import { LogoUploadDTO } from './dto/logo-upload.dto';
import { ShopListDTO } from './dto/shop-list.dto';
import { ShopDTO } from './dto/shop.dto';
import { UpdateShopDTO } from './dto/update-shop.dto';
import { ShopService } from './shop.service';

@ApiTags('Shops')
@ApiException(() => InternalServerErrorException)
@Controller('shop')
export class ShopController {
  constructor(
    private shopService: ShopService,
    private fileService: FileService,
  ) {}

  @ApiOperation({ summary: 'Find all shops' })
  @Get('all')
  async find(@Query() filtersDTO: FindShopFiltersDTO) {
    const { shops, totalCount, totalPages } = await this.shopService.find(filtersDTO);

    return new ShopListDTO({ items: shops, totalCount, totalPages });
  }

  @ApiOperation({ summary: 'Find one shop' })
  @ApiException(() => new NotFoundException('Shop with this id does not exist'))
  @Get(':shopId')
  async findOne(@Param('shopId', ParseIntPipe) shopId: number) {
    const shop = await this.shopService.findOne(shopId);
    return new ShopDTO(shop);
  }

  @ApiOperation({ summary: 'Add new shop' })
  @ApiException(() => new BadRequestException('Provided file does not exist'))
  @ApiException(() => new BadRequestException('Shop with this title already exists'))
  @ApiException(() => ForbiddenException)
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() shopDto: CreateShopDTO) {
    const shop = await this.shopService.create(shopDto);
    return new ShopDTO(shop);
  }

  @ApiOperation({ summary: 'Upload shop logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Shop logo',
    type: LogoUploadDTO,
  })
  @ApiException(
    () =>
      new BadRequestException('Validation failed (expected type is /image\\/(jpeg)|(png)|(svg)/)'),
  )
  @ApiException(() => ForbiddenException)
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @Post('logo/upload')
  async uploadLogo(
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
    const logo = await this.fileService.uploadFile(file);
    return new ImageDTO(logo);
  }

  @ApiOperation({ summary: 'Update shop' })
  @ApiException(() => new NotFoundException('Shop with this id does not exist'))
  @ApiException(() => ForbiddenException)
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Patch(':shopId')
  async update(@Param('shopId', ParseIntPipe) shopId: number, @Body() shopDto: UpdateShopDTO) {
    const shop = await this.shopService.update(shopId, shopDto);
    return new ShopDTO(shop);
  }

  @ApiOperation({ summary: 'Delete shop' })
  @ApiException(() => new NotFoundException('Shop with this id does not exist'))
  @ApiException(() => ForbiddenException)
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Delete(':shopId')
  async delete(@Param('shopId', ParseIntPipe) shopId: number) {
    const shop = await this.shopService.delete(shopId);
    return new ShopDTO(shop);
  }
}
