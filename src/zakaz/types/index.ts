export interface Product {
  ean: string;
  title: string;
  shop: string;
  url: string;
  imageUrl: string;
  description: string | null;
  price: number;
  discount: Discount | null;
  volume: number | null;
  weight: number | null;
}

export interface Discount {
  value: number;
  oldPrice: number;
}
