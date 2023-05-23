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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Authenticated } from 'src/auth/guards/authenticated.guard';
import { ImageDTO } from 'src/file/dto/file.dto';
import { FileService } from 'src/file/file.service';
import { CreateShopDTO } from 'src/shop/dto/create-shop.dto';
import { FindShopFiltersDTO } from 'src/shop/dto/find-shop-filters.dto';
import { LogoUploadDTO } from 'src/shop/dto/logo-upload.dto';
import { ShopListDTO } from 'src/shop/dto/shop-list.dto';
import { ShopDTO } from 'src/shop/dto/shop.dto';
import { UpdateShopDTO } from 'src/shop/dto/update-shop.dto';
import { ShopService } from 'src/shop/shop.service';

@ApiTags('Shops')
@Controller('shop')
export class ShopController {
  constructor(
    private shopService: ShopService,
    private fileService: FileService,
  ) {}

  @ApiOperation({ summary: 'Find all shops' })
  @Get('all')
  async find(@Query() filtersDTO: FindShopFiltersDTO) {
    const { shops, totalCount, totalPages } = await this.shopService.find(
      filtersDTO,
    );

    return new ShopListDTO({ items: shops, totalCount, totalPages });
  }

  @ApiOperation({ summary: 'Find one shop' })
  @ApiNotFoundResponse({ description: 'Shop with this id does not exist' })
  @Get(':shopId')
  async findOne(@Param('shopId', ParseIntPipe) shopId: number) {
    const shop = await this.shopService.findOne(shopId);
    return new ShopDTO(shop);
  }

  @ApiOperation({ summary: 'Add new shop' })
  @ApiBadRequestResponse({ description: 'Provided file does not exist' })
  @ApiBadRequestResponse({ description: 'Shop with this title already exists' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
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
  @ApiBadRequestResponse({
    description: 'Validation failed (expected type is /image\\/(jpeg)|(png)/)',
  })
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @Post('logo/upload')
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 2 mb max file size
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          // only jpeg and png images
          new FileTypeValidator({ fileType: /image\/(jpeg)|(png)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const logo = await this.fileService.uploadFile(file);
    return new ImageDTO(logo);
  }

  @ApiOperation({ summary: 'Update shop' })
  @ApiNotFoundResponse({ description: 'Shop with this id does not exist' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Patch(':shopId')
  async update(
    @Param('shopId', ParseIntPipe) shopId: number,
    @Body() shopDto: UpdateShopDTO,
  ) {
    const shop = await this.shopService.update(shopId, shopDto);
    return new ShopDTO(shop);
  }

  @ApiOperation({ summary: 'Delete shop' })
  @ApiNotFoundResponse({ description: 'Shop with this id does not exist' })
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Delete(':shopId')
  async delete(@Param('shopId', ParseIntPipe) shopId: number) {
    const shop = await this.shopService.delete(shopId);
    return new ShopDTO(shop);
  }
}
