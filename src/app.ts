import express from 'express';
import bodyParser from 'body-parser';
import { createHomeRouter } from './routes';
import { logger } from './utils';
import { errorHandler, loggerMiddleware } from './middlewares';

const app = express();
app.use(bodyParser.json());
app.use(loggerMiddleware);

app.use('/', createHomeRouter());

app.use(errorHandler);

const port = process.env.HTTP_PORT || 80;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
