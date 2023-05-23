// import { Shop } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';

class ImageDTO {
  id: number;
  url: string;
}

export class ShopDTO {
  id: number;
  title: string;
  isExternal: boolean;
  imageId: number;

  @ApiProperty({ type: ImageDTO })
  image: ImageDTO;

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ShopDTO>) {
    Object.assign(this, partial);
  }
}
