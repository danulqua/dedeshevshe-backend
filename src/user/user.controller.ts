import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { Authenticated } from 'src/auth/guards/authenticated.guard';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { EditProfileDTO } from 'src/user/dto/edit-profile.dto';
import { UpdateUserDTO } from 'src/user/dto/update-user.dto';
import { UserService } from 'src/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(Authenticated)
  @Get('profile')
  async findMe(@User() user) {
    const userData = await this.userService.findById(user.id);
    delete userData.passwordHash;
    return userData;
  }

  @UseGuards(Authenticated)
  @Patch('editProfile')
  editProfile(@Body() dto: EditProfileDTO, @User() user) {
    return this.userService.update(user.id, dto);
  }

  @UseGuards(Authenticated)
  @Get('all')
  async find() {
    const users = await this.userService.find();
    return users;
  }

  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateUserDTO) {
    return this.userService.create(dto);
  }

  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Patch(':userId')
  update(
    @Body() dto: UpdateUserDTO,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.userService.update(userId, dto);
  }

  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Delete(':userId')
  delete(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.delete(userId);
  }
}
