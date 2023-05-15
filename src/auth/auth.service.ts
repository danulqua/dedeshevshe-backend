import * as bcrypt from 'bcryptjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Prisma } from '@prisma/client';

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
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
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

    const passwordsMatch = await this.verifyPasswords(
      password,
      user.passwordHash,
    );
    if (!passwordsMatch) return null;

    delete user.passwordHash;
    return user;
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private verifyPasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
