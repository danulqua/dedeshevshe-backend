import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { UpdateUserDTO } from 'src/user/dto/update-user.dto';

const userSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
};

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async find() {
    const users = await this.prismaService.user.findMany();
    return users.map((user) => {
      delete user.passwordHash;
      return user;
    });
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException();

    return user;
  }

  async findById(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException();

    return user;
  }

  async create(dto: CreateUserDTO) {
    const userFromDB = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (userFromDB) throw new BadRequestException('Email is already in use');

    const passwordHash = await this.hashPassword(dto.password);

    const user = await this.prismaService.user.create({
      data: { email: dto.email, passwordHash, name: dto.name },
      select: userSelect,
    });

    return user;
  }

  async edit(userId: number, dto: UpdateUserDTO) {
    const userFromDB = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!userFromDB)
      throw new BadRequestException(`User with id ${userId} not found`);

    const passwordHash = dto.password
      ? await this.hashPassword(dto.password)
      : undefined;

    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { email: dto.email, passwordHash, name: dto.name },
    });

    return user;
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
