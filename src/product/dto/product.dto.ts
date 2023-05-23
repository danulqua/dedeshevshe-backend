import { ProductStatus } from '@prisma/client';

export class ProductDTO {
  id: number;
  title: string;
  url: string;
  description: string;
  price: number;
  discount: number | null;
  oldPrice: number | null;
  volume: number | null;
  weight: number | null;
  isExternal: boolean;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: number | null;
  shopId: number;
  imageId: number | null;
  shop: {
    id: number;
    title: string;
    image: {
      id: number;
      url: string;
    } | null;
  };
  user: {
    id: number;
    name: string;
  } | null;
  image: {
    id: number;
    url: string;
  } | null;

  constructor(product: Partial<ProductDTO>) {
    Object.assign(this, product);
  }
}

export class ProductFromZakazDTO extends ProductDTO {
  ean: string;
  imageUrl: string;

  constructor(product: Partial<ProductFromZakazDTO>) {
    super(product);
    Object.assign(this, product);
  }
}
