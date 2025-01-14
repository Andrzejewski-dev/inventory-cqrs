import { ProductModel } from '../models';
import {
  RestockProductCommandHandler,
  RestockProductParams,
} from './restock-product.command';

jest.mock('../models');

describe('restockProduct', () => {
  let handler: RestockProductCommandHandler;
  beforeEach(() => {
    jest.clearAllMocks();
    handler = new RestockProductCommandHandler();
  });

  it('should restock the product successfully', async () => {
    const mockProduct = {
      _id: 'product1',
      stock: 10,
      save: jest.fn().mockResolvedValue({}),
    };

    (ProductModel.findById as jest.Mock).mockResolvedValue(mockProduct);

    const params: RestockProductParams = {
      id: 'product1',
      quantity: 5,
    };

    await handler.execute(params);

    expect(ProductModel.findById).toHaveBeenCalledWith('product1');
    expect(mockProduct.save).toHaveBeenCalled();
    expect(mockProduct.stock).toBe(15);
  });

  it('should throw an error if the product is not found', async () => {
    (ProductModel.findById as jest.Mock).mockResolvedValue(null);

    const params: RestockProductParams = {
      id: 'product1',
      quantity: 5,
    };

    await expect(handler.execute(params)).rejects.toThrow('Product not found');
    expect(ProductModel.findById).toHaveBeenCalledWith('product1');
  });

  it('should handle errors when saving the product', async () => {
    const mockProduct = {
      _id: 'product1',
      stock: 10,
      save: jest.fn().mockRejectedValue(new Error('Database error')),
    };

    (ProductModel.findById as jest.Mock).mockResolvedValue(mockProduct);

    const params: RestockProductParams = {
      id: 'product1',
      quantity: 5,
    };

    await expect(handler.execute(params)).rejects.toThrow('Database error');
    expect(ProductModel.findById).toHaveBeenCalledWith('product1');
  });
});
