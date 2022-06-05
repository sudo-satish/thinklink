import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as CoinGecko from 'coingecko-api';
import { Model } from 'mongoose';
import { Price, PriceDocument } from 'src/db/schemas/price.schema';

export enum Coin {
  bitcoin = 'bitcoin',
}

@Injectable()
export class CoinGeckoService {
  client: CoinGecko;
  constructor(
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
  ) {
    this.client = new CoinGecko();
  }

  async fetchCoin(coinId: Coin) {
    const { data } = await this.client.simple.price({
      ids: [coinId],
      vs_currencies: ['usd'],
    });
    const price = data?.[coinId]?.usd;
    const date = new Date();

    const priceObj = {
      price,
      name: coinId,
      date,
    };

    const createdPrice = new this.priceModel(priceObj);
    return createdPrice.save();
  }
}
