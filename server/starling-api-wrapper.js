const _ = require('lodash');
const moment = require('moment');
const debug = require('debug')('app:starling-api-wrapper');
const axios = require('axios');
const config = require('./config');

const REFRESH_TOKEN_EARLY_OFFSET_SECS = 10;
const REFRESH_TOKEN_GRANT_TYPE = 'refresh_token';

const resolveWithJsonAtPath = (log, promise, res, path) => {
  return promise
    .then(response => {
      debug('Received', log, 'returning path', path);
      res.json(_.get(response, path, []));
    })
    .catch((e) => {
      debug('Error getting', log, { status: e.status, error: e.data.error, description: e.data.error_description });
      return res.status(403).send(e.data.error);
    });
};

const transactions = (req, res, client, accessToken) => resolveWithJsonAtPath('my transactions', client.getTransactions(accessToken, req.query.fromDate = '2016-03-01', req.query.toDate = moment().format('YYYY-MM-DD'), req.query.source), res, 'data._embedded.transactions');
const balance = (req, res, client, accessToken) => resolveWithJsonAtPath('my balance', client.getBalance(accessToken), res, 'data');
const customer = (req, res, client, accessToken) => resolveWithJsonAtPath('my customer', client.getCustomer(accessToken), res, 'data');

/**
 * A middleware to check for the presence of the access token in the
 * user session. If the access token is present and has expired,
 * the refresh token is used to obtain a new access token and refresh token
 */
const oauthAccessTokenMiddleware = (req, res, next) => {
  const accessToken = req.session.accessToken;
  const accessTokenExpiry = req.session.accessTokenExpiry;

  if (!accessToken) {
    res.status(401).send({error: 'NOT_AUTHORIZED'});
    return;
  }

  if (accessTokenExpiry <= new Date()) {
    refreshAccessToken(req.session.refreshToken)
      .then(response => {
        saveAccessTokenToSession(response.data, req);
        next();
      })
      .catch(() => {
        res.status(500).send({error: 'ACCESS_TOKEN_REFRESH_ERROR'});
      });
  } else {
    next()
  }
};

/**
 * Persists the access token and refresh token to the user session. This is called when
 *
 *   1) the access code is exchanged for the access and refresh tokens and
 *   2) when the refresh token is used to obtain a new access and refresh token
 */
const saveAccessTokenToSession = (accessTokenResponse, req) => {
  req.session.accessToken = accessTokenResponse.access_token;
  req.session.refreshToken = accessTokenResponse.refresh_token;
  const now = new Date();
  now.setSeconds(now.getSeconds() + accessTokenResponse.expires_in - REFRESH_TOKEN_EARLY_OFFSET_SECS);
  req.session.accessTokenExpiry = now;
};

/**
 * Calls the Starling authorisation endpoint to exchange the refresh token for a new access and refresh token.
 * This is typically used when the access token is expired.
 */
const refreshAccessToken = (refreshToken, environment = 'production') => {
  const params = {
    refresh_token: refreshToken,
    grant_type: REFRESH_TOKEN_GRANT_TYPE,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  };
  debug('refreshAccessToken :: ', params, environment);
  return getOAuthToken(params, environment);
};

/**
 * Starling upstream resource to retrieve an access token (or refresh token)
 */
const getOAuthToken = (params, environment) => {
  const url = environment === 'sandbox' ? config.sandboxApi : config.productionApi;
  debug('getOAuthToken :: ', url, params, environment);
  return axios({
    url: `${url}/oauth/access-token`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: params
  });
};

module.exports = { getOAuthToken, saveAccessTokenToSession, refreshAccessToken, oauthAccessTokenMiddleware, transactions, balance, customer };
