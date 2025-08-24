
import pino from 'pino';

const logLevel = (process.env.LOG_LEVEL || 'info') as pino.Level;

export const logger = pino({
  level: logLevel,
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        }
      : undefined,
});
