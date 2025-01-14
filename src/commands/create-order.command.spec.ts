import { ProductModel, OrderModel } from '../models';
import {
  CreateOrderCommandHandler,
  CreateOrderParams,
} from './create-order.command';

jest.mock('../models');

describe('createOrder', () => {
  let handler: CreateOrderCommandHandler;
  beforeEach(() => {
    jest.clearAllMocks();
    handler = new CreateOrderCommandHandler();
  });

  it('should throw an error if there is insufficient stock', async () => {
    const mockProducts = [
      { _id: 'product1', stock: 5, price: 100 },
      { _id: 'product2', stock: 2, price: 50 },
    ];

    (ProductModel.find as jest.Mock).mockResolvedValue(mockProducts);

    const params: CreateOrderParams = {
      customerId: 'customer1',
      products: [
        { productId: 'product1', quantity: 3 },
        { productId: 'product2', quantity: 5 }, // Insufficient stock
      ],
    };

    await expect(handler.execute(params)).rejects.toThrow(
      'Insufficient stock for one or more products',
    );

    expect(ProductModel.find).toHaveBeenCalledWith({
      _id: { $in: ['product1', 'product2'] },
    });
  });

  it('should create an order and update stock levels', async () => {
    const mockProducts = [
      { _id: 'product1', stock: 5, price: 100, id: 'product1' },
      { _id: 'product2', stock: 10, price: 50, id: 'product2' },
    ];

    (ProductModel.find as jest.Mock).mockResolvedValue(mockProducts);
    (ProductModel.bulkWrite as jest.Mock).mockResolvedValue({});
    (OrderModel.prototype.save as jest.Mock).mockResolvedValue({});

    const params: CreateOrderParams = {
      customerId: 'customer1',
      products: [
        { productId: 'product1', quantity: 2 },
        { productId: 'product2', quantity: 3 },
      ],
    };

    await handler.execute(params);

    expect(ProductModel.find).toHaveBeenCalledWith({
      _id: { $in: ['product1', 'product2'] },
    });

    expect(ProductModel.bulkWrite).toHaveBeenCalledWith([
      {
        updateOne: {
          filter: { _id: 'product1' },
          update: { $inc: { stock: -2 } },
        },
      },
      {
        updateOne: {
          filter: { _id: 'product2' },
          update: { $inc: { stock: -3 } },
        },
      },
    ]);

    expect(OrderModel.prototype.save).toHaveBeenCalled();

    const total = 2 * 100 + 3 * 50; // 350
    expect(OrderModel).toHaveBeenCalledWith({
      customerId: 'customer1',
      products: params.products,
      total,
    });
  });

  it('should handle empty product lists gracefully', async () => {
    const params: CreateOrderParams = {
      customerId: 'customer1',
      products: [],
    };

    await expect(handler.execute(params)).resolves.not.toThrow();

    expect(ProductModel.find).not.toHaveBeenCalled();
    expect(ProductModel.bulkWrite).not.toHaveBeenCalled();
    expect(OrderModel.prototype.save).toHaveBeenCalled();

    expect(OrderModel).toHaveBeenCalledWith({
      customerId: 'customer1',
      products: [],
      total: 0,
    });
  });
});
