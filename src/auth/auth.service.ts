import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Prisma } from '@prisma/client';
import { ResetPasswordDTO } from 'src/auth/dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';

interface AuthParams {
  email: string;
  password: string;
}

const userSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
};

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  async signUp({ email, password }: AuthParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userExists) throw new BadRequestException('Email is already in use');

    const passwordHash = await this.hashPassword(password);
    const name = email.split('@')[0];

    const user = await this.prismaService.user.create({
      data: { email, passwordHash, name },
      select: userSelect,
    });

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const passwordsMatch = await this.verifyPasswords(password, user.passwordHash);
    if (!passwordsMatch) return null;

    delete user.passwordHash;
    return user;
  }

  async resetPassword({ email }: ResetPasswordDTO) {
    const user = await this.userService.findByEmail(email);
    const token = crypto.randomBytes(32).toString('hex');

    // Token will expire at 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prismaService.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    await this.mailService.sendResetPasswordLink(user, token);

    return { message: 'Check your email for further instructions' };
  }

  async changePassword(token: string, password: string) {
    const resetToken = await this.validateToken(token);

    const passwordHash = await this.hashPassword(password);

    await this.prismaService.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    });

    await this.prismaService.passwordResetToken.delete({
      where: { id: resetToken.id },
    });
  }

  async validateToken(token: string) {
    const resetToken = await this.prismaService.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    const isValid = resetToken && resetToken.expiresAt > new Date();
    if (!isValid) throw new UnauthorizedException('Invalid or expired token');

    return resetToken;
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private verifyPasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
