import winston from 'winston';

const level = process.env.LOG_LEVEL;

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`,
  ),
);

const transports = [
  new winston.transports.Console(),
  ...(['true', '1'].includes(`${process.env.LOG_FILE_ENABLED}`.toLowerCase())
    ? [
        new winston.transports.File({
          filename: `logs/log_${+new Date()}.log`,
        }),
      ]
    : []),
];

export const logger = winston.createLogger({
  level,
  format,
  transports,
});
