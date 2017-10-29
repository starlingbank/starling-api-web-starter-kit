const config = require('./config');
const debug = require('debug')('app:oauth');

const uid = require('uid-safe');
const Starling = require('starling-developer-sdk');
const starlingApiWrapper = require('./starling-api-wrapper');

const ACCESS_TOKEN_GRANT_TYPE = 'authorization_code';

/**
 * Calls the starling authorization endpoint to exchanges the access code for an access and refresh token.
 */
const getAccessToken = code => {
  return starlingApiWrapper.getOAuthToken({
    code,
    grant_type: ACCESS_TOKEN_GRANT_TYPE,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.oauthRedirectUri
  });
};

const start = (app) => {
  const starlingClient = new Starling({ apiUrl: config.sandboxApi });

  /**
   * Handle the "Connect with Starling" event. Redirects the user agent to Starling to authenticate the customer.
   * Creates a local session for the user. Starling will redirect back to "/oauth" when the user has granted
   * permission.
   */
  app.get('/api/oauth/login', (req, res) => {
    const oauthState = uid.sync(18);
    req.session.oauthState = oauthState;
    res.redirect(
      `${config.oauthApi}/oauth?response_type=code&redirect_uri=` +
      `${config.oauthRedirectUri}&state=${oauthState}&client_id=${config.clientId}`);
  });

  /**
   * Handles the oauth redirect. Starling will redirect the user agent
   * to this endpoint passing the authorization code, which is later exchanged
   * for an access and refresh token
   */
  app.get('/api/oauth/redirect', (req, res) => {
    const requestState = req.query.state,
      authorizationCode = req.query.code,
      error = req.query.error;

    if (error) {
      res.redirect('/?error=' + error);
      return;
    }

    if (req.session.oauthState && requestState !== req.session.oauthState) {
      res.status(400).send();
      return;
    }

    getAccessToken(authorizationCode)
      .then(response => {
        debug(authorizationCode, response.data);
        starlingApiWrapper.saveAccessTokenToSession(response.data, req);
        res.redirect('/');
      })
      .catch((e) => {
        debug('getAccessToken – Error', e.data);
        res.redirect('/oauth');
      });
  });

  app.get('/api/oauth/transactions', starlingApiWrapper.oauthAccessTokenMiddleware, (req, res) => {
    return starlingApiWrapper.transactions(req, res, starlingClient, req.session.accessToken);
  });
  app.get('/api/oauth/balance', starlingApiWrapper.oauthAccessTokenMiddleware, (req, res) => {
    return starlingApiWrapper.balance(req, res, starlingClient, req.session.accessToken);
  });
  app.get('/api/oauth/customer', starlingApiWrapper.oauthAccessTokenMiddleware, (req, res) => {
    return starlingApiWrapper.customer(req, res, starlingClient, req.session.accessToken);
  });
};

module.exports = { start };
