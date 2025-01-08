import mongoose, { Schema, Document } from 'mongoose';
import { OrderDto } from '../types';

export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface IOrder extends Document {
  customerId: string;
  products: OrderProduct[];
  createdAt: Date;
  total: number;
}

const OrderSchema = new Schema<IOrder>({
  customerId: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  total: { type: Number, required: true },
});

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);
