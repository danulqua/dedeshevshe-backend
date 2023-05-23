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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { Authenticated } from 'src/auth/guards/authenticated.guard';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { EditProfileDTO } from 'src/user/dto/edit-profile.dto';
import { FindUserFiltersDTO } from 'src/user/dto/find-user-filters.dto';
import { UpdateUserDTO } from 'src/user/dto/update-user.dto';
import { UserListDTO } from 'src/user/dto/user-list.dto';
import { UserDTO } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get my profile' })
  @UseGuards(Authenticated)
  @Get('profile')
  async findMe(@User() user) {
    const userData = await this.userService.findById(user.id);
    delete userData.passwordHash;

    return new UserDTO(userData);
  }

  @ApiOperation({ summary: 'Edit my profile' })
  @UseGuards(Authenticated)
  @Patch('editProfile')
  async editProfile(@Body() dto: EditProfileDTO, @User() user) {
    const updatedUser = await this.userService.update(user.id, dto);
    return new UserDTO(updatedUser);
  }

  @ApiOperation({ summary: 'Find all users' })
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Get('all')
  async find(@Query() filtersDTO: FindUserFiltersDTO) {
    const { users, totalCount, totalPages } = await this.userService.find(
      filtersDTO,
    );

    return new UserListDTO({ items: users, totalCount, totalPages });
  }

  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Get(':userId')
  async findOne(@Param('userId', ParseIntPipe) userId: number) {
    const user = await this.userService.findById(userId);
    return new UserDTO(user);
  }

  @ApiOperation({ summary: 'Create new user' })
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() dto: CreateUserDTO) {
    const user = await this.userService.create(dto);
    return new UserDTO(user);
  }

  @ApiOperation({ summary: 'Update user' })
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Patch(':userId')
  async update(
    @Body() dto: UpdateUserDTO,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const user = await this.userService.update(userId, dto);
    return new UserDTO(user);
  }

  @ApiOperation({ summary: 'Delete user' })
  @UseGuards(Authenticated)
  @Roles(UserRole.ADMIN)
  @Delete(':userId')
  async delete(@Param('userId', ParseIntPipe) userId: number) {
    const user = await this.userService.delete(userId);
    return new UserDTO(user);
  }
}
