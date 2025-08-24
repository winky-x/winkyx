
import 'dotenv/config';
import { buildServer } from './server';
import { logger } from './lib/logger';

const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || '0.0.0.0';

const server = buildServer();

const start = async () => {
  try {
    await server.listen({ port, host });
    logger.info(`Server listening at http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
