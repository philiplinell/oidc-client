import express from 'express';
import logger from '../utils/logger.js';

class WebServer {
  constructor (port) {
    this.port = port;
    this.expressApp = express();

    this.init();
  }

  init () {
    // Middleware
    this.expressApp.use((req, _, next) => {
      logger.info(`${req.method}: ${req.originalUrl}`);
      next();
    });

    // Routing
    this.expressApp.get('/', (req, res) => {
      res.json({
        message: 'Hello 👋'
      });
    });

    // 404 Handler
    this.expressApp.use((req, res) => {
      res.status(404).json({
        message: 'Not Found'
      });
    });

    // Error Handler
    this.expressApp.use((err, req, res, next) => {
      logger.err(err.message);

      err.status = err.status ?? 500;

      res.status(err.status).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : ''
      });
    });
  }

  start () {
    return new Promise((resolve, reject) => {
      this.expressApp = this.expressApp.listen(this.port, err => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }

  close () {
    return new Promise((resolve, reject) => {
      this.expressApp.close(err => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }
}

export default WebServer;
