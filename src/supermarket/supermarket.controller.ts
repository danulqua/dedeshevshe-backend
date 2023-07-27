import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../auth/decorators/user.decorator';
import { AuthDTO } from '../auth/dto/auth.dto';
import { AuthLocal } from '../auth/guards/auth-local.guard';
import { Authenticated } from '../auth/guards/authenticated.guard';
import { ImageDTO } from '../file/dto/file.dto';
import { FileService } from '../file/file.service';
import { CreateProductDTO } from '../product/dto/create-product.dto';
import { ImageUploadDTO } from '../product/dto/image-upload.dto';
import { ProductDTO } from '../product/dto/product.dto';
import { ProductService } from '../product/product.service';
import { FindShopFiltersDTO } from '../shop/dto/find-shop-filters.dto';
import { ShopListDTO } from '../shop/dto/shop-list.dto';
import { ShopService } from '../shop/shop.service';
import { UserDTO } from '../user/dto/user.dto';

@ApiTags('Для супермаркетів')
@Controller('supermarket')
export class SupermarketController {
  constructor(
    private productService: ProductService,
    private shopService: ShopService,
    private fileService: FileService,
  ) {}

  @ApiOperation({
    summary: 'Вхід в обліковий запис',
    description: `Використовуйте цей ендпоїнт для входу в обліковий запис для супермаркетів.
      Після входу, ви зможете створювати запити на додавання своїх продуктів
      у систему ДеДешевше.\n
      Email: supermarket@dedeshevshe.com
      Пароль: QYwDi4.q7EkDFouesMyj
    `,
  })
  @ApiException(() => new NotFoundException('User with this email not found'))
  @ApiException(() => UnauthorizedException)
  @ApiOkResponse({ type: UserDTO })
  @UseGuards(AuthLocal)
  @Post('/auth/signIn')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: AuthDTO, @User() user) {
    return user;
  }

  @ApiOperation({ summary: 'Вихід з облікового запису' })
  @ApiException(() => ForbiddenException)
  @ApiOkResponse({ description: 'Signed out' })
  @UseGuards(Authenticated)
  @Post('/auth/signOut')
  @HttpCode(HttpStatus.OK)
  signOut(@Request() req) {
    req.session.destroy();
    return { message: 'Signed out' };
  }

  @ApiOperation({
    summary: 'Створення запиту на додавання продукту',
    description: `Ви, як супермаркет, можете створити запит на додавання свого
      продукту у систему ДеДешевше. Для цього потрібно аутентифікуватись у системі
      під обліковим записом для супермаркетів, використовуючи
      \`/api/supermarket/auth/signIn\`\nПри додаванні продукту обовʼязково потрібно
      вказувати ID супермаркету, у який його буде додано. Для пошуку супермаркета
      використовуйте \`/api/supermarket/all\`\nПри створенні продукту потрібно додати
      його зображення. Для цього використовуйте ендпоїнт \`/api/supermarket/product/image/upload\`
    `,
  })
  @ApiException(() => new BadRequestException('Provided file does not exist'))
  @ApiException(() => new BadRequestException('Shop with this id does not exist'))
  @ApiException(() => new BadRequestException('User with this id does not exist'))
  @ApiException(() => ForbiddenException)
  @UseGuards(Authenticated)
  @Roles(UserRole.SUPERMARKET)
  @Post('product/request')
  async createRequest(@Body() productDTO: CreateProductDTO, @User() user) {
    const product = await this.productService.create(user.id, {
      ...productDTO,
      status: 'IN_REVIEW',
    });
    return new ProductDTO(product);
  }

  @ApiOperation({
    summary: 'Пошук супермаркетів',
    description: `Використовуйте цей ендпоїнт щоб знайти ваш супермаркет.`,
  })
  @Get('all')
  async find(@Query() filtersDTO: FindShopFiltersDTO) {
    const { shops, totalCount, totalPages } = await this.shopService.find(filtersDTO);

    return new ShopListDTO({ items: shops, totalCount, totalPages });
  }

  @ApiOperation({
    summary: 'Завантаження зображення продукту',
    description: `Ви можете використовувати цей ендпоїнт для завантаження
      зображення продукту перед тим, як його створити. Після завантаження,
      використовуйте отриманий ідентифікатор зображення при створенні продукту.
    `,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Product image', type: ImageUploadDTO })
  @ApiException(
    () =>
      new BadRequestException('Validation failed (expected type is /image\\/(jpeg)|(png)|(svg)/)'),
  )
  @ApiException(() => ForbiddenException)
  @UseGuards(Authenticated)
  @UseInterceptors(FileInterceptor('file'))
  @Post('product/image/upload')
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
}
