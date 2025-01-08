import { Request, Response, Router } from 'express';

export function createHomeRouter(): Router {
  const router = Router();

  router.get('/', (_req: Request, res: Response) => {
    res.json({
      message: 'Welcome to the Inventory CQRS API',
      endpoints: {
        products: '/api/products',
        orders: '/api/orders',
      },
      documentation: '/api-docs',
    });
  });

  return router;
}
