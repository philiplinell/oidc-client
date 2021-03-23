import logger from '../utils/logger.js';
import { Issuer } from 'openid-client';

class OIDC {
  constructor (authServerURI) {
    this.authServerURI = authServerURI;
  }

  async discover () {
    try {
      logger.debug(`Requesting metadata from ${this.authServerURI}`);
      this.issuer = await Issuer.discover(this.authServerURI);
      logger.debug(`Got issuer data: ${JSON.stringify(this.issuer.metadata)}`);
    } catch (err) {
      throw new Error(`could not discover metadata: ${err}`);
    }
  }

  async registerAsClient () {
    try {
      // fixme
    } catch (err) {
      throw new Error(`could not register as client: ${err}`);
    }
  }
}

export default OIDC;
