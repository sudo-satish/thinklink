import { Controller, Get, Query } from '@nestjs/common';
import { PriceService } from 'src/services/price.service';
import { PaginationParams } from 'src/validators/paginationParams';

const getQueryString = (query) =>
  Reflect.ownKeys(query)
    .filter((key) => query[key])
    .map((key) => `${String(key)}=${query[key]}`)
    .join('&');

@Controller('prices')
export class PriceController {
  constructor(private readonly service: PriceService) {}
  // Assuming we have only coin "btc" for now, We can make it dynamic later by using ":coinId" param
  @Get('btc')
  async getPrices(@Query() { offset, limit, date }: PaginationParams) {
    const _offset = offset || 0;
    const _limit = limit || 100;

    const nextOffset = _offset + _limit;
    // Date here passed are string, It should be passed as where = {date, ...otherFilters};
    const prices = await this.service.getPrices(date, _offset, _limit);
    const priceCount = await this.service.getPricesCount(date);

    let next;
    const url = 'http://localhost:8000/api/prices/btc';
    if (nextOffset < priceCount) {
      const query = {
        offset: nextOffset,
        limit: _limit,
        date,
      };
      next = `${url}?${getQueryString(query)}`;
    }

    const query = {
      offset: _offset,
      limit: _limit,
      date,
    };
    const currentUrl = `http://localhost://api/prices/btc?${getQueryString(
      query,
    )}`;

    return {
      url: currentUrl,
      next: next,
      count: priceCount,
      data: prices.map(({ name, price, date }) => ({
        coin: name,
        price,
        timestamp: date.getTime(),
      })),
    };
  }
}
