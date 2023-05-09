import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { zakazApi } from 'src/zakaz/api';
import { capitalize } from 'src/utils';
import { Shop } from 'src/zakaz/api/types';

@Injectable()
export class ZakazService {
  async getShops() {
    try {
      const shops: Shop[] = [];

      // Fetch shops
      const response = await zakazApi.get('/stores');
      console.log(response);
      const { data } = response;

      // Filter out unique shops
      data.forEach((shop) => {
        const { id, retail_chain } = shop;

        if (!shops.find((item) => item.title.toLowerCase() === retail_chain)) {
          shops.push({ id, title: capitalize(retail_chain) });
        }
      });

      return shops;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
