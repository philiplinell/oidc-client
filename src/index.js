import 'dotenv/config.js';
import logger from './utils/logger.js';
import OIDC from './oidc/oidc.js';
import WebServer from './net/webserver.js';

logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`LOG_LEVEL: ${process.env.LOG_LEVEL}`);
logger.info(`AUTH_SERVER_URL: ${process.env.AUTH_SERVER_URL}`);

const port = process.env.PORT || 9191;

if (!process.env.AUTH_SERVER_URL) {
  logger.error('Missing env AUTH_SERVER_URL');
  process.exit(1);
}

const oidc = new OIDC(process.env.AUTH_SERVER_URL);

const webServer = new WebServer(port);

oidc.discover()
  .then(webServer.start())
  .then(() => {
    logger.info(`Listening on port ${port}...`);
  })
  .catch(err => {
    logger.error(err);
  });

process.on('SIGINT', async () => {
  logger.info('Got SIGINT. Shutting down');
  await shutdown();
});

process.on('SIGTERM', async () => {
  logger.info('Got SIGTERM. Shutting down');
  await shutdown();
});

const shutdown = async () => {
  try {
    await webServer.close();
  } catch (err) {
    logger.error(`Got error while shutting down server: ${err}`);
    process.exitCode = 1;
  }
  logger.info('Server shutdown!');
  process.exit();
};
