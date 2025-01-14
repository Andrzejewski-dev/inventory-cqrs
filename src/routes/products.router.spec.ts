import request from 'supertest';
import express from 'express';
import { CreateProductParams } from '../commands';
import { ICommandBus, IQueryBus } from '../types';
import { createProductsRouter } from './products.router';

jest.mock('../models');

describe('Products API', () => {
  let app: express.Express;
  let commandBus: ICommandBus;
  let queryBus: IQueryBus;

  beforeEach(() => {
    commandBus = {
      execute: jest.fn(),
    } as unknown as ICommandBus;

    queryBus = {
      execute: jest.fn(),
    } as unknown as IQueryBus;

    app = express();
    app.use(express.json());
    app.use('/api', createProductsRouter(commandBus, queryBus));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /products', () => {
    it('should return a list of products', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          description: 'Desc 1',
          price: 100,
          stock: 10,
        },
        {
          id: '2',
          name: 'Product 2',
          description: 'Desc 2',
          price: 200,
          stock: 20,
        },
      ];
      (queryBus.execute as jest.Mock).mockResolvedValue(mockProducts);

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
      expect(queryBus.execute).toHaveBeenCalledWith('GetProducts', {});
    });
  });

  describe('GET /products/:id', () => {
    it('should return a product by ID', async () => {
      const mockProduct = {
        id: '1',
        name: 'Product 1',
        description: 'Desc 1',
        price: 100,
        stock: 10,
      };
      (queryBus.execute as jest.Mock).mockResolvedValue(mockProduct);

      const response = await request(app).get('/api/products/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProduct);
      expect(queryBus.execute).toHaveBeenCalledWith('GetProductById', {
        id: '1',
      });
    });

    it('should return 404 if product not found', async () => {
      (queryBus.execute as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/products/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Product not found' });
    });
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const newProduct: CreateProductParams = {
        name: 'New Product',
        description: 'New Product Description',
        price: 150,
        stock: 20,
      };

      (commandBus.execute as jest.Mock).mockResolvedValue({
        id: '1',
        ...newProduct,
      });

      const response = await request(app)
        .post('/api/products')
        .send(newProduct);

      expect(response.status).toBe(202);
    });

    it('should return 400 if product creation fails', async () => {
      const newProduct: CreateProductParams = {
        name: '', // Invalid name
        description: 'New Product Description',
        price: -150, // Invalid price
        stock: -10, // Invalid stock
      };

      const response = await request(app)
        .post('/api/products')
        .send(newProduct);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /products/:id/restock', () => {
    it('should restock a product', async () => {
      const product = { id: '1', stock: 20 };
      const updatedProduct = { id: '1', stock: 30 };

      (queryBus.execute as jest.Mock).mockResolvedValue(product);
      (commandBus.execute as jest.Mock).mockResolvedValue(updatedProduct);

      const response = await request(app)
        .post('/api/products/1/restock')
        .send({ quantity: 10 });

      expect(response.status).toBe(202);
    });

    it('should return 404 if product not found', async () => {
      (commandBus.execute as jest.Mock).mockRejectedValue(
        new Error('Product not found'),
      );

      const response = await request(app)
        .post('/api/products/1/restock')
        .send({ quantity: 10 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Product not found');
    });
  });

  describe('POST /products/:id/sell', () => {
    it('should sell a product', async () => {
      const product = { id: '1', stock: 20 };
      const updatedProduct = { id: '1', stock: 15 };

      (queryBus.execute as jest.Mock).mockResolvedValue(product);
      (commandBus.execute as jest.Mock).mockResolvedValue(updatedProduct);

      const response = await request(app)
        .post('/api/products/1/sell')
        .send({ quantity: 5 });

      expect(response.status).toBe(202);
    });

    it('should return 400 if not enough stock to sell', async () => {
      const product = { id: '1', stock: 20 };
      (queryBus.execute as jest.Mock).mockResolvedValue(product);
      (commandBus.execute as jest.Mock).mockRejectedValue(
        new Error('Not enough stock available'),
      );

      const response = await request(app)
        .post('/api/products/1/sell')
        .send({ quantity: 50 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Not enough stock available');
    });

    it('should return 404 if product not found', async () => {
      (commandBus.execute as jest.Mock).mockRejectedValue(
        new Error('Product not found'),
      );

      const response = await request(app)
        .post('/api/products/1/sell')
        .send({ quantity: 10 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Product not found');
    });
  });
});
