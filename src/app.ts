import express from 'express';
import bodyParser from 'body-parser';
import { serve, setup } from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import {
  createHomeRouter,
  createOrdersRouter,
  createProductsRouter,
} from './routes';
import { CommandBus, QueryBus } from './buses';
import { connectDB } from './db';
import { logger } from './utils';
import { errorHandler, loggerMiddleware } from './middlewares';
import {
  CreateOrderCommandHandler,
  CreateProductCommandHandler,
  RestockProductCommandHandler,
  SellProductCommandHandler,
} from './commands';
import {
  GetOrdersQueryHandler,
  GetProductByIdQueryHandler,
  GetProductsQueryHandler,
} from './queries';

const app = express();
app.use(bodyParser.json());
app.use(loggerMiddleware);

const commandBus = new CommandBus();
commandBus.register('CreateProduct', new CreateProductCommandHandler());
commandBus.register('RestockProduct', new RestockProductCommandHandler());
commandBus.register('SellProduct', new SellProductCommandHandler());
commandBus.register('CreateOrder', new CreateOrderCommandHandler());

const queryBus = new QueryBus();
queryBus.register('GetProductById', new GetProductByIdQueryHandler());
queryBus.register('GetProducts', new GetProductsQueryHandler());
queryBus.register('GetOrders', new GetOrdersQueryHandler());

app.use('/', createHomeRouter());
app.use('/api', createProductsRouter(commandBus, queryBus));
app.use('/api', createOrdersRouter(commandBus, queryBus));
app.use('/api-docs', serve, setup(swaggerDocument));

app.use(errorHandler);

const port = process.env.HTTP_PORT || 80;

connectDB(process.env.MONGO_URI as string).then(() => {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
});
