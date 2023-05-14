export interface Shop {
  id: string;
  title: string;
}

export interface SearchProductsByShopFilters {
  shopId: string;
  maxPrice: number;
  discountsOnly: boolean;
}

export interface SearchProductsFilters {
  maxPrice: number;
  discountsOnly: boolean;
}

export interface SearchProductsResponse {
  results: ProductResponse[];
}

export interface ProductResponse {
  ean: string;
  title: string;
  shop: string;
  web_url: string;
  img: ImageResponse | null;
  description: string | null;
  price: number;
  discount: DiscountResponse | null;
  volume: number | null;
  weight: number | null;
  in_stock: boolean;
}

interface ImageResponse {
  s150x150: string;
  s200x200: string;
  s350x350: string;
  s1350x1350: string;
}

interface DiscountResponse {
  value: number;
  old_price: number;
}
