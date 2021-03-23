import winston from 'winston';

const {
  combine, timestamp, label, printf
} = winston.format;

const customFormat = printf(({
  level, message, label, timestamp
}) => `${timestamp} [${label}] ${level}: ${message}`);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [new winston.transports.Console()],
  format: combine(
    label({ label: 'url-shorterner' }),
    timestamp(),
    customFormat
  )
});

export default logger;
