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

  async registerAsClient (registrationToken) {
    try {
      logger.debug(`Registering as client on ${this.issuer.metadata.registration_endpoint}`);
      this.clientData = await this.issuer.Client.register({
        application_type: 'web',
        client_name: 'My Example Client',
        client_description: 'An example client for testing OIDC',
        redirect_uris: ['http://localhost:9191']
      }, {
        initialAccessToken: registrationToken
      });

      logger.debug(`Registered as client with id ${this.clientData.client_id}`);
    } catch (err) {
      throw new Error(`could not register as client: ${err}`);
    }
  }
}

export default OIDC;
