import { Resend } from 'resend';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { resetPasswordHTML } from 'src/mail/templates/reset-password.template';

@Injectable()
export class MailService {
  constructor(private config: ConfigService) {}

  private resend = new Resend(this.config.get('RESEND_API_KEY'));
  private mailDomain = this.config.get('MAIL_DOMAIN');

  async sendResetPasswordLink(user: User, token: string) {
    const clientBaseUrl = this.config.get('CLIENT_BASE_URL');
    const url = `${clientBaseUrl}/auth/resetPassword?token=${token}`;

    try {
      const data = await this.resend.emails.send({
        from: `ДеДешевше <noreply@${this.mailDomain}>`,
        to: user.email,
        subject: 'Зміна паролю',
        html: resetPasswordHTML({ name: user.name, url }),
      });

      return data;
    } catch (error) {}
  }
}
