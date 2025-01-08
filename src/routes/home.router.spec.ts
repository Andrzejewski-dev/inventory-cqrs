import request from 'supertest';
import express from 'express';
import { createHomeRouter } from './home.router';

describe('Home API', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(createHomeRouter());
  });

  describe('GET /', () => {
    it('should return a welcome message with endpoints and documentation link', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        message: 'Welcome to the Inventory CQRS API',
        endpoints: {
          products: '/api/products',
          orders: '/api/orders',
        },
        documentation: '/api-docs',
      });
    });
  });
});
