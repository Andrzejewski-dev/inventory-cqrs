import express from 'express';
import bodyParser from 'body-parser';
import { createHomeRouter } from './routes';
import { logger } from './utils';
import { errorHandler, loggerMiddleware } from './middlewares';
import { connectDB } from './db';

const app = express();
app.use(bodyParser.json());
app.use(loggerMiddleware);

app.use('/', createHomeRouter());

app.use(errorHandler);

const port = process.env.HTTP_PORT || 80;
connectDB(process.env.MONGO_URI as string).then(() => {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
});
