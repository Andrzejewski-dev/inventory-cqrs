import { ProductModel } from '../models';
import {
  SellProductParams,
  SellProductCommandHandler,
} from './sell-product.command';

jest.mock('../models');

describe('sellProduct', () => {
  let handler: SellProductCommandHandler;
  beforeEach(() => {
    jest.clearAllMocks();
    handler = new SellProductCommandHandler();
  });

  it('should sell the product successfully', async () => {
    const mockProduct = {
      _id: 'product1',
      stock: 10,
      save: jest.fn().mockResolvedValue({}),
    };

    (ProductModel.findById as jest.Mock).mockResolvedValue(mockProduct);

    const params: SellProductParams = {
      id: 'product1',
      quantity: 5,
    };

    await handler.execute(params);

    expect(ProductModel.findById).toHaveBeenCalledWith('product1');
    expect(mockProduct.save).toHaveBeenCalled();
    expect(mockProduct.stock).toBe(5);
  });

  it('should throw an error if the product is not found', async () => {
    (ProductModel.findById as jest.Mock).mockResolvedValue(null);

    const params: SellProductParams = {
      id: 'product1',
      quantity: 5,
    };

    await expect(handler.execute(params)).rejects.toThrow('Product not found');
    expect(ProductModel.findById).toHaveBeenCalledWith('product1');
  });

  it('should throw an error if there is not enough stock', async () => {
    const mockProduct = {
      _id: 'product1',
      stock: 3,
      save: jest.fn().mockResolvedValue({}),
    };

    (ProductModel.findById as jest.Mock).mockResolvedValue(mockProduct);

    const params: SellProductParams = {
      id: 'product1',
      quantity: 5,
    };

    await expect(handler.execute(params)).rejects.toThrow(
      'Not enough stock available',
    );
    expect(ProductModel.findById).toHaveBeenCalledWith('product1');
  });

  it('should handle errors when saving the product', async () => {
    const mockProduct = {
      _id: 'product1',
      stock: 10,
      save: jest.fn().mockRejectedValue(new Error('Database error')),
    };

    (ProductModel.findById as jest.Mock).mockResolvedValue(mockProduct);

    const params: SellProductParams = {
      id: 'product1',
      quantity: 5,
    };

    await expect(handler.execute(params)).rejects.toThrow('Database error');
    expect(ProductModel.findById).toHaveBeenCalledWith('product1');
  });
});
