import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import ErrorMiddleware from './middlewares/errorMiddleware.js';
import UserRouter from './router/userRoutes.js';
import HttpException from './utils/httpException.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: 'json' };
import logger from './utils/logger.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/employees', UserRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.all('*', (req, _, next) => {
  next(new HttpException(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(ErrorMiddleware);
app.listen(process.env.PORT || 5000, () => {
  logger.info(`Server running on port : ${process.env.PORT || 5000}`);
});
