import { ProductModel, toProductDto } from '../models';
import {
  GetProductByIdParams,
  GetProductByIdQueryHandler,
} from './get-product-by-id.query';

jest.mock('../models');

describe('getProductById', () => {
  let handler: GetProductByIdQueryHandler;
  beforeEach(() => {
    jest.clearAllMocks();
    handler = new GetProductByIdQueryHandler();
  });

  it('should return a product DTO when the product is found', async () => {
    const mockProduct = {
      _id: 'product1',
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      stock: 10,
    };

    const mockProductDto = {
      id: 'product1',
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      stock: 10,
    };

    (ProductModel.findById as jest.Mock).mockResolvedValue(mockProduct);
    (toProductDto as jest.Mock).mockImplementation((product) => ({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    }));

    const params: GetProductByIdParams = { id: 'product1' };
    const result = await handler.execute(params);

    expect(ProductModel.findById).toHaveBeenCalledWith('product1');
    expect(toProductDto).toHaveBeenCalledWith(mockProduct);
    expect(result).toEqual(mockProductDto);
  });

  it('should return null if the product is not found', async () => {
    (ProductModel.findById as jest.Mock).mockResolvedValue(null);

    const params: GetProductByIdParams = { id: 'product1' };
    const result = await handler.execute(params);

    expect(ProductModel.findById).toHaveBeenCalledWith('product1');
    expect(result).toBeNull();
  });

  it('should handle errors when fetching the product', async () => {
    (ProductModel.findById as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    const params: GetProductByIdParams = { id: 'product1' };

    await expect(handler.execute(params)).rejects.toThrow('Database error');
  });
});
