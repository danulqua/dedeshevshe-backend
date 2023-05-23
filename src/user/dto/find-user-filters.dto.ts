import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

type UserSortBy = keyof Omit<User, 'passwordHash'>;
const userSortBy: UserSortBy[] = [
  'id',
  'name',
  'email',
  'role',
  'createdAt',
  'updatedAt',
];

export class FindUserFiltersDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @Matches(/^(id|name|email|role|createdAt|updatedAt)$/i, {
    message: `sortBy must be ${userSortBy.join(', ')}`,
  })
  sortBy?: UserSortBy;

  @IsOptional()
  @Matches(/^(asc|desc)$/i, { message: 'order must be asc or desc' })
  order?: 'asc' | 'desc';
}
