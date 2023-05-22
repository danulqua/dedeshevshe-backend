import { Image } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ImageDTO implements Image {
  id: number;
  url: string;

  @Exclude()
  key: string;

  @Exclude()
  isActive: boolean;

  @Exclude()
  createdAt: Date;

  constructor(partial: Partial<ImageDTO>) {
    Object.assign(this, partial);
  }
}
