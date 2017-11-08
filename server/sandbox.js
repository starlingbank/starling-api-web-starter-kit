const _ = require('lodash');
const config = require('./config');
const Starling = require('starling-developer-sdk');
const starlingApiWrapper = require('./starling-api-wrapper');
const persistence = require('./sandboxTokenPersistence');
const debug = require('debug')('app:sandbox');

const EXPIRY_THRESHOLD = 15 * 60 * 1000;

const pullTokensFromConfig = (db) => {
  persistence.setSandboxTokens(db, {
    access_token: config.sandboxAccessToken,
    refresh_token: config.refreshToken,
    token_type: 'Bearer',
    expires_in: 0
  });
};

const initialiseSandboxTokenStore = (db) => {
  // Check DB
  const tokenStore = persistence.getSandboxTokens(db);
  debug('initialiseSandboxTokenStore :: Existing token store', tokenStore);
  const access_token = tokenStore ? tokenStore[ 'access_token' ] : null;
  if (!access_token) {
    debug('initialiseSandboxTokenStore :: ' +
      'creating token store with tokens from app configuration', config.sandboxAccessToken, config.refreshToken);
    pullTokensFromConfig(db);
  }

  keepSandboxTokensFresh(db);
};

const keepSandboxTokensFresh = (db) => {
  // Refresh using DB token immediately
  refresh(db).catch((e) => {
    debug('Refresh token is invalid, trying again after pull from app config',
      _.get(e, 'response.status'), _.get(e, 'response.data.error'), _.get(e, 'response.data.error_description'));
    pullTokensFromConfig(db);

    // Try refresh using DB token
    refresh(db).catch((err) => {
      console.error('Your refresh tokens (persisted and the one in config) have both been used before, ' +
        'use the developer portal to generate new tokens, put then in the configuration file here and restart. (',
        _.get(err, 'response.status'), _.get(err, 'response.data.error'),
        _.get(err, 'response.data.error_description'), ')');
    });
  });

  setTimeout(() => keepSandboxTokensFresh(db), EXPIRY_THRESHOLD);
};

const refresh = (db) => {
  const tokenStore = persistence.getSandboxTokens(db);
  const refresh_token = tokenStore ? tokenStore[ 'refresh_token' ] : null;
  debug('refresh :: refreshing access token with refresh_token', refresh_token);
  if (!refresh_token) {
    console.error('ERROR: missing refresh token. Update your app configuration with a new refresh token.');
    return;
  }

  return starlingApiWrapper.refreshAccessToken(refresh_token, 'sandbox')
    .then(response => {
      debug('refresh :: refreshed access token OK', response.data);
      persistence.setSandboxTokens(db, response.data);
    });
};

const start = (app) => {
  debug('Starting sandbox app...');

  let db;
  debug('Initialising sandbox token store...');
  persistence.initialise((readyDb) => {
    db = readyDb;
    debug('Sandbox token store db ready');
    initialiseSandboxTokenStore(db);
    debug('Sandbox app started.');
  });

  const getAccessToken = (db) => persistence.getSandboxTokens(db)[ 'access_token' ];
  const starlingClient = new Starling({ apiUrl: config.sandboxApi });

  app.get('/api/sandbox/transactions', (req, res) => {
    return starlingApiWrapper.transactions(req, res, starlingClient, getAccessToken(db));
  });
  app.get('/api/sandbox/balance', (req, res) => {
    return starlingApiWrapper.balance(req, res, starlingClient, getAccessToken(db));
  });
  app.get('/api/sandbox/customer', (req, res) => {
    return starlingApiWrapper.customer(req, res, starlingClient, getAccessToken(db));
  });
};

module.exports = { start };
