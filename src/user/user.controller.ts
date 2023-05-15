import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators/user.decorator';
import { Authenticated } from 'src/auth/guards/authenticated.guard';
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
}
