import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthDTO } from 'src/auth/dto/auth.dto';
import { ChangePasswordDTO } from 'src/auth/dto/change-password.dto';
import { ResetPasswordDTO } from 'src/auth/dto/reset-password.dto';
import { ValidateTokenDTO } from 'src/auth/dto/validate-token.dto';
import { AuthLocal } from 'src/auth/guards/auth-local.guard';
import { Authenticated } from 'src/auth/guards/authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signUp')
  register(@Body() dto: AuthDTO) {
    return this.authService.signUp(dto);
  }

  @UseGuards(AuthLocal)
  @Post('/signIn')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AuthDTO, @User() user) {
    return user;
  }

  @UseGuards(Authenticated)
  @Post('/signOut')
  @HttpCode(HttpStatus.OK)
  logout(@Request() req) {
    req.session.destroy();
    return { message: 'Signed out' };
  }

  @Post('/resetPassword')
  resetPassword(@Body() dto: ResetPasswordDTO) {
    return this.authService.resetPassword(dto);
  }

  @Post('/validateToken')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() { token }: ValidateTokenDTO) {
    const isValid = await this.authService.validateToken(token);
    return { isValid };
  }

  @Patch('/changePassword')
  async changePassword(@Body() { token, password }: ChangePasswordDTO) {
    await this.authService.changePassword(token, password);
    return { message: 'Password changed successfully' };
  }
}
