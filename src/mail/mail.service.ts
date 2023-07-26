import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private config: ConfigService) {}

  async sendResetPasswordLink(user: User, token: string) {
    const clientBaseUrl = this.config.get('CLIENT_BASE_URL');
    const url = `${clientBaseUrl}/auth/resetPassword?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: '[ДеДешевше] Підтвердження скидання паролю',
      template: 'reset-password',
      context: {
        name: user.name,
        url,
      },
    });
  }
}
