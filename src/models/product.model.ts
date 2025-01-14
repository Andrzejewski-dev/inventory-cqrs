import mongoose, { Schema, Document } from 'mongoose';
import { ProductDto } from '../types';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    description: { type: String, required: true, maxlength: 50 },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);

export const toProductDto = (product: IProduct): ProductDto => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  stock: product.stock,
});
