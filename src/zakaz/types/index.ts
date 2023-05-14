export interface ProductZakaz {
  ean: string;
  title: string;
  shop: string;
  url: string;
  imageUrl: string;
  description: string | null;
  price: number;
  discount: DiscountZakaz | null;
  volume: number | null;
  weight: number | null;
}

export interface DiscountZakaz {
  value: number;
  oldPrice: number;
}
