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
import { FindUserFiltersDTO } from 'src/user/dto/find-user-filters.dto';

const userSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
};

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async find(filtersDTO: FindUserFiltersDTO = {}) {
    const { name, email, role, limit, page = 1, sortBy, order } = filtersDTO;

    const query: Prisma.UserFindManyArgs = {
      where: {
        AND: [
          name ? { name: { contains: name, mode: 'insensitive' } } : {},
          email ? { email: { contains: email, mode: 'insensitive' } } : {},
          role ? { role } : {},
        ],
      },
      select: { ...userSelect, createdAt: true, updatedAt: true },
      orderBy: sortBy ? { [sortBy]: order ?? 'asc' } : undefined,
      take: limit,
      skip: limit,
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
    }

    const [users, totalCount] = await Promise.all([
      this.prismaService.user.findMany(query),
      this.prismaService.user.count({ where: query.where }),
    ]);

    const totalPages = totalCount ? Math.ceil(totalCount / limit) || 1 : 0;

    return { users, totalCount, totalPages };
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user)
      throw new NotFoundException(`User with email '${email}' not found`);

    return user;
  }

  async findById(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    return user;
  }

  async create(dto: CreateUserDTO) {
    const userFromDB = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (userFromDB) throw new BadRequestException('Email is already in use');

    const passwordHash = await this.hashPassword(dto.password);

    const { email, name, role } = dto;
    const user = await this.prismaService.user.create({
      data: { email, passwordHash, name, role },
      select: userSelect,
    });

    return user;
  }

  async update(userId: number, dto: UpdateUserDTO) {
    const userFromDB = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!userFromDB)
      throw new NotFoundException(`User with id ${userId} not found`);

    const passwordHash = dto.password
      ? await this.hashPassword(dto.password)
      : undefined;

    const { email, name, role } = dto;
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { email, passwordHash, name, role },
    });

    return user;
  }

  async delete(userId: number) {
    const userFromDB = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!userFromDB)
      throw new NotFoundException(`User with id ${userId} not found`);

    const user = await this.prismaService.user.delete({
      where: { id: userId },
      select: userSelect,
    });

    return user;
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
