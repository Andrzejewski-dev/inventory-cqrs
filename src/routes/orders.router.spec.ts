import request from 'supertest';
import express from 'express';
import { createOrdersRouter } from './orders.router'; // Adjust path if necessary
import { ICommandBus, IQueryBus } from '../types';
import { CreateOrderParams } from '../commands';

jest.mock('../models');

describe('Orders API', () => {
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
    app.use('/api', createOrdersRouter(commandBus, queryBus));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /orders', () => {
    it('should return a list of orders', async () => {
      const mockOrders = [
        {
          id: '1',
          customerId: 'customer1',
          products: [
            { productId: '1', quantity: 2 },
            { productId: '2', quantity: 3 },
          ],
          total: 500,
        },
        {
          id: '2',
          customerId: 'customer2',
          products: [{ productId: '3', quantity: 1 }],
          total: 200,
        },
      ];

      (queryBus.execute as jest.Mock).mockResolvedValue(mockOrders);

      const response = await request(app).get('/api/orders');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrders);
      expect(queryBus.execute).toHaveBeenCalledWith('GetOrders', {});
    });
  });

  describe('POST /orders', () => {
    it('should create a new order', async () => {
      const newOrder: CreateOrderParams = {
        customerId: 'customer1',
        products: [
          { productId: '1', quantity: 2 },
          { productId: '2', quantity: 3 },
        ],
      };

      const createdOrder = { id: '1', ...newOrder, total: 500 };
      (queryBus.execute as jest.Mock)
        .mockResolvedValueOnce({ id: '1', stock: 20 })
        .mockResolvedValueOnce({ id: '2', stock: 20 });
      (commandBus.execute as jest.Mock).mockResolvedValue(createdOrder);

      const response = await request(app).post('/api/orders').send(newOrder);

      expect(response.status).toBe(202);
      expect(commandBus.execute).toHaveBeenCalledWith('CreateOrder', newOrder);
    });

    it('should return 404 if a product is not found', async () => {
      (queryBus.execute as jest.Mock).mockResolvedValueOnce(null);

      const newOrder: CreateOrderParams = {
        customerId: 'customer1',
        products: [{ productId: '999', quantity: 1 }],
      };

      const response = await request(app).post('/api/orders').send(newOrder);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Product not found with id 999');
    });

    it('should return 400 if not enough stock is available', async () => {
      (queryBus.execute as jest.Mock).mockResolvedValueOnce({
        id: '1',
        stock: 2,
      });

      const newOrder: CreateOrderParams = {
        customerId: 'customer1',
        products: [{ productId: '1', quantity: 3 }],
      };

      const response = await request(app).post('/api/orders').send(newOrder);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        `Not enough stock available for product with id 1`,
      );
    });
  });
});
