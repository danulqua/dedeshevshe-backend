import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendResetPasswordLink(user: User, token: string) {
    const url = `http://localhost:5000/auth/resetPassword?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: '[Grocify] Reset password confirmation',
      template: 'reset-password',
      context: {
        name: user.name,
        url,
      },
    });
  }
}
