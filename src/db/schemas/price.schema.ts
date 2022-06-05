import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PriceDocument = Price & Document;

@Schema()
export class Price {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  date: Date;
}

export const PriceSchema = SchemaFactory.createForClass(Price);
