import { User } from '@prisma/client';

interface UserListParams {
  totalCount: number;
  totalPages: number;
  items: User[];
}

export class UserListDTO {
  totalCount: number;
  totalPages: number;
  items: User[];

  constructor({ items, totalCount, totalPages }: UserListParams) {
    this.totalCount = totalCount;
    this.totalPages = totalPages;
    this.items = items;
  }
}
