import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserAuthDTO {
  id: number;
  email: string;
  name: string;

  @ApiProperty({ enum: UserRole })
  role: string;
}

export class UserDTO {
  id: number;
  email: string;
  name: string;

  @ApiProperty({ enum: UserRole })
  role: string;

  createdAt: Date;
  updatedAt: Date;
}
