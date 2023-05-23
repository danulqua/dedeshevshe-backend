import { ApiProperty } from '@nestjs/swagger';

export interface PriceHistoryItem {
  price: number;
  createdAt: Date;
}

export class PriceHistoryItemDTO implements PriceHistoryItem {
  price: number;
  createdAt: Date;

  constructor(priceHistoryItem: Partial<PriceHistoryItemDTO>) {
    Object.assign(this, priceHistoryItem);
  }
}

export class PriceHistoryDTO {
  product: {
    id: number;
    title: string;
  };
  shop: {
    id: number;
    title: string;
  };
  @ApiProperty({ type: [PriceHistoryItemDTO] })
  priceHistory: PriceHistoryItem[];

  constructor(priceHistory: Partial<PriceHistoryDTO>) {
    Object.assign(this, priceHistory);
  }
}
