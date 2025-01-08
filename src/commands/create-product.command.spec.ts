import { ProductModel } from '../models';
import {
  CreateProductCommandHandler,
  CreateProductParams,
} from './create-product.command';

jest.mock('../models');

describe('createProduct', () => {
  let handler: CreateProductCommandHandler;
  beforeEach(() => {
    jest.clearAllMocks();
    handler = new CreateProductCommandHandler();
  });

  it('should create a product successfully', async () => {
    (ProductModel.prototype.save as jest.Mock).mockResolvedValue({});

    const data: CreateProductParams = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 100.0,
      stock: 50,
    };

    await handler.execute(data);

    expect(ProductModel).toHaveBeenCalledWith(data);
    expect(ProductModel.prototype.save).toHaveBeenCalled();
  });

  it('should throw an error if saving the product fails', async () => {
    (ProductModel.prototype.save as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    const data: CreateProductParams = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 100.0,
      stock: 50,
    };

    await expect(handler.execute(data)).rejects.toThrow('Database error');

    expect(ProductModel).toHaveBeenCalledWith(data);
    expect(ProductModel.prototype.save).toHaveBeenCalled();
  });
});
