import { createLogger, format, transports } from 'winston';
const { printf, timestamp, combine, errors } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    format.colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // errors({ stack: true }),
    logFormat
  ),
  transports: [new transports.Console()],
});

export default logger;
