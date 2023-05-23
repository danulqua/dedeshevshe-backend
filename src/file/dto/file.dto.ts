import { ApiHideProperty } from '@nestjs/swagger';
import { Image } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ImageDTO implements Image {
  id: number;
  url: string;

  @Exclude()
  @ApiHideProperty()
  key: string;

  @Exclude()
  @ApiHideProperty()
  isActive: boolean;

  @Exclude()
  @ApiHideProperty()
  createdAt: Date;

  constructor(partial: Partial<ImageDTO>) {
    Object.assign(this, partial);
  }
}
