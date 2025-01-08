import { Request, Response, Router } from 'express';
import { ICommandBus, IQueryBus, ProductDto } from '../types';
import { GetProductByIdParams, GetProductsParams } from '../queries';
import {
  CreateProductParams,
  RestockProductParams,
  SellProductParams,
} from '../commands';
import {
  createProductSchema,
  restockProductSchema,
  sellProductSchema,
} from '../validations';
import { asyncHandler, validate } from '../middlewares';

export function createProductsRouter(
  commandBus: ICommandBus,
  queryBus: IQueryBus,
): Router {
  const router = Router();

  router.get(
    '/products',
    asyncHandler(async (_req: Request, res: Response) => {
      const products = await queryBus.execute<GetProductsParams, ProductDto[]>(
        'GetProducts',
        {},
      );
      res.json(products);
    }),
  );

  router.get(
    '/products/:id',
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const product = await queryBus.execute<
        GetProductByIdParams,
        ProductDto | null
      >('GetProductById', { id });
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(product);
    }),
  );

  router.post(
    '/products',
    validate(createProductSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const { name, description, price, stock } = req.body;
      await commandBus.execute<CreateProductParams>('CreateProduct', {
        name,
        description,
        price,
        stock,
      });
      res.sendStatus(202);
    }),
  );

  router.post(
    '/products/:id/restock',
    validate(restockProductSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const { quantity } = req.body;
      const product = await queryBus.execute<
        GetProductByIdParams,
        ProductDto | null
      >('GetProductById', { id });
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      await commandBus.execute<RestockProductParams>('RestockProduct', {
        id,
        quantity,
      });
      res.sendStatus(202);
    }),
  );

  router.post(
    '/products/:id/sell',
    validate(sellProductSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const { quantity } = req.body;
      const product = await queryBus.execute<
        GetProductByIdParams,
        ProductDto | null
      >('GetProductById', { id });
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      if (product.stock < quantity) {
        res.status(400).json({ error: 'Not enough stock available' });
        return;
      }

      await commandBus.execute<SellProductParams>('SellProduct', {
        id,
        quantity,
      });
      res.sendStatus(202);
    }),
  );

  return router;
}
