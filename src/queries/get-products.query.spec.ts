import { ProductModel, toProductDto } from '../models';
import { GetProductsQueryHandler } from './get-products.query';

jest.mock('../models');

describe('getProducts', () => {
  let handler: GetProductsQueryHandler;
  beforeEach(() => {
    jest.clearAllMocks();
    handler = new GetProductsQueryHandler();
  });

  it('should return a list of product DTOs', async () => {
    const mockProducts = [
      {
        _id: 'product1',
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        stock: 10,
      },
      {
        _id: 'product2',
        name: 'Product 2',
        description: 'Description 2',
        price: 200,
        stock: 5,
      },
    ];

    const mockProductDtos = [
      {
        id: 'product1',
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        stock: 10,
      },
      {
        id: 'product2',
        name: 'Product 2',
        description: 'Description 2',
        price: 200,
        stock: 5,
      },
    ];

    (ProductModel.find as jest.Mock).mockResolvedValue(mockProducts);
    (toProductDto as jest.Mock).mockImplementation((product) => ({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    }));

    const result = await handler.execute();

    expect(ProductModel.find).toHaveBeenCalled();
    expect(toProductDto).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mockProductDtos);
  });

  it('should return an empty list if no products are found', async () => {
    (ProductModel.find as jest.Mock).mockResolvedValue([]);

    const result = await handler.execute();

    expect(ProductModel.find).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should handle errors when fetching products', async () => {
    (ProductModel.find as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(handler.execute()).rejects.toThrow('Database error');
  });
});
