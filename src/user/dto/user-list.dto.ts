import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserDTO } from 'src/user/dto/user.dto';

interface UserListParams {
  totalCount: number;
  totalPages: number;
  items: User[];
}

export class UserListDTO {
  totalCount: number;
  totalPages: number;

  @ApiProperty({ type: [UserDTO] })
  items: UserDTO[];

  constructor({ items, totalCount, totalPages }: UserListParams) {
    this.totalCount = totalCount;
    this.totalPages = totalPages;
    this.items = items;
  }
}
