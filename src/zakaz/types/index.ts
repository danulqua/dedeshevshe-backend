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

export type ProductZakazWithShop = Omit<ProductZakaz, 'shop'> & {
  shop: {
    id: number;
    title: string;
    image?: {
      id: number;
      url: string;
    };
  };
};

export interface DiscountZakaz {
  value: number;
  oldPrice: number;
}
