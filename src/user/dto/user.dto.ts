import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserAuthDTO {
  id: number;
  email: string;
  name: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;
}

export class UserDTO {
  id: number;
  email: string;
  name: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
