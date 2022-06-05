import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Price, PriceDocument } from 'src/db/schemas/price.schema';
import * as moment from 'moment';

@Injectable()
export class PriceService {
  constructor(
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
  ) {}

  async getPrices(date, documentsToSkip = 0, limitOfDocuments?: number) {
    let where = {};
    if (date) {
      const today = moment(date, 'DD-MM-YYYY').startOf('day');
      where = {
        date: {
          $gte: today.toDate(),
          $lte: moment(today).endOf('day').toDate(),
        },
      };
    }

    const query = this.priceModel
      .find(where)
      .sort({ _id: -1 })
      .skip(documentsToSkip);

    if (limitOfDocuments) {
      query.limit(limitOfDocuments);
    }
    return query;
  }

  async getPricesCount(date) {
    let where = {};
    if (date) {
      const today = moment(date, 'DD-MM-YYYY').startOf('day');
      where = {
        date: {
          $gte: today.toDate(),
          $lte: moment(today).endOf('day').toDate(),
        },
      };
    }
    const query = this.priceModel.count(where);
    return query;
  }
}
