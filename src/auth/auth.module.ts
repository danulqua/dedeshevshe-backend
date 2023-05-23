import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from 'src/auth/stategies/local.strategy';
import { SessionSerializer } from 'src/auth/serializers/session.serializer';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [UserModule, PassportModule.register({ session: true }), MailModule],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
