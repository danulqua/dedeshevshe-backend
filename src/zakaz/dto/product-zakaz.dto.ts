import { DiscountZakaz, ProductZakaz } from 'src/zakaz/types';

export class DiscountZakazDTO implements DiscountZakaz {
  value: number;
  oldPrice: number;
}

export class ProductZakazDTO implements ProductZakaz {
  ean: string;
  title: string;
  shop: string;
  url: string;
  imageUrl: string;
  description: string | null;
  price: number;
  discount: DiscountZakazDTO | null;
  volume: number | null;
  weight: number | null;
}

export class ProductZakazListDTO {
  items: ProductZakazDTO[];
}
