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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthDTO } from 'src/auth/dto/auth.dto';
import { ChangePasswordDTO } from 'src/auth/dto/change-password.dto';
import { ResetPasswordDTO } from 'src/auth/dto/reset-password.dto';
import { IsValidDTO, ValidateTokenDTO } from 'src/auth/dto/validate-token.dto';
import { AuthLocal } from 'src/auth/guards/auth-local.guard';
import { Authenticated } from 'src/auth/guards/authenticated.guard';
import { UserAuthDTO, UserDTO } from 'src/user/dto/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up' })
  @ApiCreatedResponse({ type: UserAuthDTO })
  @ApiBadRequestResponse({ description: 'Email is already in use' })
  @Post('/signUp')
  signUp(@Body() dto: AuthDTO) {
    return this.authService.signUp(dto);
  }

  @ApiOperation({ summary: 'Sign in' })
  @ApiNotFoundResponse({ description: 'User with this email not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: UserDTO })
  @UseGuards(AuthLocal)
  @Post('/signIn')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: AuthDTO, @User() user) {
    return user;
  }

  @ApiOperation({ summary: 'Sign out' })
  @ApiOkResponse({ description: 'Signed out' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @UseGuards(Authenticated)
  @Post('/signOut')
  @HttpCode(HttpStatus.OK)
  signOut(@Request() req) {
    req.session.destroy();
    return { message: 'Signed out' };
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiCreatedResponse({
    description: 'Check your email for further instructions',
  })
  @ApiNotFoundResponse({ description: 'User with this email not found' })
  @Post('/resetPassword')
  resetPassword(@Body() dto: ResetPasswordDTO) {
    return this.authService.resetPassword(dto);
  }

  @ApiOperation({ summary: 'Reset password token validation' })
  @ApiOkResponse({ type: IsValidDTO })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  @Post('/validateToken')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() { token }: ValidateTokenDTO) {
    await this.authService.validateToken(token);
    return { isValid: true };
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiOkResponse({ description: 'Password changed successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  @Patch('/changePassword')
  async changePassword(@Body() { token, password }: ChangePasswordDTO) {
    await this.authService.changePassword(token, password);
    return { message: 'Password changed successfully' };
  }
}
