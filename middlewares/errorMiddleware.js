import logger from '../utils/logger.js';

function ErrorMiddleware(error, _, res, _next) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  logger.error(message);

  res.status(status).send({
    status,
    message,
  });
}

export default ErrorMiddleware;
