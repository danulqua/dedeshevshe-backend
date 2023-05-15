import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators/user.decorator';
import { Authenticated } from 'src/auth/guards/authenticated.guard';
import { EditProfileDTO } from 'src/user/dto/edit-profile.dto';
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
  async editProfile(@Body() dto: EditProfileDTO, @User() user) {
    return this.userService.edit(user.id, dto);
  }

  @UseGuards(Authenticated)
  @Get('all')
  async find() {
    const users = await this.userService.find();
    return users;
  }
}
