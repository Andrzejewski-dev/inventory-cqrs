import { ProductModel } from '../models';
import { CommandHandler } from '../types';

export interface CreateProductParams {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export class CreateProductCommandHandler
  implements CommandHandler<CreateProductParams>
{
  async execute(params: CreateProductParams): Promise<void> {
    const product = new ProductModel(params);
    await product.save();
  }
}
