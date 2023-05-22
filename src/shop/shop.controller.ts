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
import { Authenticated } from 'src/auth/guards/authenticated.guard';
import { ImageDTO } from 'src/file/dto/file.dto';
import { FileService } from 'src/file/file.service';
import { CreateShopDTO } from 'src/shop/dto/create-shop.dto';
import { FindShopFiltersDTO } from 'src/shop/dto/find-shop-filters.dto';
import { ShopListDTO } from 'src/shop/dto/shop-list.dto';
import { UpdateShopDTO } from 'src/shop/dto/update-shop.dto';
import { ShopService } from 'src/shop/shop.service';

@Controller('shop')
export class ShopController {
  constructor(
    private shopService: ShopService,
    private fileService: FileService,
  ) {}

  @Get('all')
  async find(@Query() filtersDTO: FindShopFiltersDTO) {
    const { shops, totalCount, totalPages } = await this.shopService.find(
      filtersDTO,
    );

    return new ShopListDTO({ items: shops, totalCount, totalPages });
  }

  @Get(':shopId')
  findOne(@Param('shopId', ParseIntPipe) shopId: number) {
    return this.shopService.findOne(shopId);
  }

  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() shopDto: CreateShopDTO) {
    return this.shopService.create(shopDto);
  }

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

  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Patch(':shopId')
  update(
    @Param('shopId', ParseIntPipe) shopId: number,
    @Body() shopDto: UpdateShopDTO,
  ) {
    return this.shopService.update(shopId, shopDto);
  }

  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Delete(':shopId')
  delete(@Param('shopId', ParseIntPipe) shopId: number) {
    return this.shopService.delete(shopId);
  }
}
