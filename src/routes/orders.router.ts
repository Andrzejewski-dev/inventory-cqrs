import { Request, Response, Router } from 'express';
import { createOrderSchema } from '../validations';
import { ICommandBus, IQueryBus, OrderDto, ProductDto } from '../types';
import { asyncHandler, validate } from '../middlewares';
import { GetOrdersParams, GetProductByIdParams } from '../queries';
import { CreateOrderParams } from '../commands';

export const createOrdersRouter = (
  commandBus: ICommandBus,
  queryBus: IQueryBus,
): Router => {
  const router = Router();

  router.get(
    '/orders',
    asyncHandler(async (_req: Request, res: Response) => {
      const orders = await queryBus.execute<GetOrdersParams, OrderDto[]>(
        'GetOrders',
        {},
      );
      res.json(orders);
    }),
  );

  router.post(
    '/orders',
    validate(createOrderSchema),
    asyncHandler(async (req: Request, res: Response) => {
      for (const { productId, quantity } of req.body.products) {
        const product = await queryBus.execute<
          GetProductByIdParams,
          ProductDto | null
        >('GetProductById', { id: productId });
        if (!product) {
          res
            .status(404)
            .json({ error: `Product not found with id ${productId}` });
          return;
        }
        if (product.stock < quantity) {
          res.status(400).json({
            error: `Not enough stock available for product with id ${productId}`,
          });
          return;
        }
      }
      await commandBus.execute<CreateOrderParams>('CreateOrder', req.body);
      res.sendStatus(202);
    }),
  );

  return router;
};
