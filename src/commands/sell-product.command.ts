import { ProductModel } from '../models';
import { CommandHandler } from '../types';

export interface SellProductParams {
  id: string;
  quantity: number;
}

export class SellProductCommandHandler
  implements CommandHandler<SellProductParams>
{
  async execute({ id, quantity }: SellProductParams): Promise<void> {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    if (product.stock < quantity) {
      throw new Error('Not enough stock available');
    }
    product.stock -= quantity;
    await product.save();
  }
}
