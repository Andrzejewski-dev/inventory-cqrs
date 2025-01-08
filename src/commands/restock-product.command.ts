import { ProductModel } from '../models';
import { CommandHandler } from '../types';

export interface RestockProductParams {
  id: string;
  quantity: number;
}

export class RestockProductCommandHandler
  implements CommandHandler<RestockProductParams>
{
  async execute({ id, quantity }: RestockProductParams): Promise<void> {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    product.stock += quantity;
    await product.save();
  }
}
