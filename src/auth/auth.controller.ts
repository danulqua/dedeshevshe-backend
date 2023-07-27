import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { AuthDTO } from './dto/auth.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { IsValidDTO, ValidateTokenDTO } from './dto/validate-token.dto';
import { AuthLocal } from './guards/auth-local.guard';
import { Authenticated } from './guards/authenticated.guard';
import { UserAuthDTO, UserDTO } from '../user/dto/user.dto';

@ApiTags('Auth')
@ApiException(() => InternalServerErrorException)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up' })
  @ApiException(() => new BadRequestException('Email is already in use'))
  @ApiCreatedResponse({ type: UserAuthDTO })
  @Post('/signUp')
  signUp(@Body() dto: AuthDTO) {
    return this.authService.signUp(dto);
  }

  @ApiOperation({ summary: 'Sign in' })
  @ApiException(() => new NotFoundException('User with this email not found'))
  @ApiException(() => UnauthorizedException)
  @ApiOkResponse({ type: UserDTO })
  @UseGuards(AuthLocal)
  @Post('/signIn')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: AuthDTO, @User() user) {
    return user;
  }

  @ApiOperation({ summary: 'Sign out' })
  @ApiException(() => ForbiddenException)
  @ApiOkResponse({ description: 'Signed out' })
  @UseGuards(Authenticated)
  @Post('/signOut')
  @HttpCode(HttpStatus.OK)
  signOut(@Request() req) {
    req.session.destroy();
    return { message: 'Signed out' };
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiException(() => new NotFoundException('User with this email not found'))
  @ApiCreatedResponse({
    description: 'Check your email for further instructions',
  })
  @Post('/resetPassword')
  resetPassword(@Body() dto: ResetPasswordDTO) {
    return this.authService.resetPassword(dto);
  }

  @ApiOperation({ summary: 'Reset password token validation' })
  @ApiException(() => new UnauthorizedException('Invalid or expired token'))
  @ApiOkResponse({ type: IsValidDTO })
  @Post('/validateToken')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() { token }: ValidateTokenDTO) {
    await this.authService.validateToken(token);
    return { isValid: true };
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiException(() => new UnauthorizedException('Invalid or expired token'))
  @ApiOkResponse({ description: 'Password changed successfully' })
  @Patch('/changePassword')
  async changePassword(@Body() { token, password }: ChangePasswordDTO) {
    await this.authService.changePassword(token, password);
    return { message: 'Password changed successfully' };
  }
}
