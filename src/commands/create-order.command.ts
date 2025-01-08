import { OrderModel, ProductModel } from '../models';
import { CommandHandler } from '../types';

export interface CreateOrderParams {
  customerId: string;
  products: {
    productId: string;
    quantity: number;
  }[];
}

export class CreateOrderCommandHandler
  implements CommandHandler<CreateOrderParams>
{
  async execute({ customerId, products }: CreateOrderParams): Promise<void> {
    const productIds = products.map((p: { productId: string }) => p.productId);
    const dbProducts = productIds.length
      ? await ProductModel.find({ _id: { $in: productIds } })
      : [];

    const insufficientStock = products.filter(
      (p: { productId: string; quantity: number }) => {
        const dbProduct = dbProducts.find((prod) => prod.id === p.productId);
        return !dbProduct || dbProduct.stock < p.quantity;
      },
    );

    if (insufficientStock.length > 0) {
      throw new Error('Insufficient stock for one or more products');
    }

    const bulkOperations = products.map(
      (p: { productId: string; quantity: number }) => ({
        updateOne: {
          filter: { _id: p.productId },
          update: { $inc: { stock: -p.quantity } },
        },
      }),
    );

    if (bulkOperations.length) {
      await ProductModel.bulkWrite(bulkOperations);
    }

    const total = dbProducts.reduce((acc, dbProduct) => {
      const productInOrder = products.find(
        (p: { productId: string }) => p.productId === dbProduct.id,
      );
      return acc + dbProduct.price * (productInOrder?.quantity || 0);
    }, 0);

    const order = new OrderModel({ customerId, products, total });
    await order.save();
  }
}
