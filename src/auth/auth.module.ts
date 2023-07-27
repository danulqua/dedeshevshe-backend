import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './stategies/local.strategy';
import { SessionSerializer } from './serializers/session.serializer';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [UserModule, PassportModule.register({ session: true }), MailModule],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
