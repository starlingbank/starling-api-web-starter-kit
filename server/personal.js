const config = require('./config');
const Starling = require('starling-developer-sdk');
const starlingApiWrapper = require('./starling-api-wrapper');

const start = (app) => {
  const starlingClient = new Starling();

  if (config.offline) {
    const exampleData = require('./example-data');
    app.get('/api/my/transactions', (req, res) => res.json(exampleData.transactions));
    app.get('/api/my/balance', (req, res) => res.json(exampleData.balance));
    app.get('/api/my/customer', (req, res) => res.json(exampleData.customer));
  } else {
    app.get('/api/my/transactions', (req, res) => {
      return starlingApiWrapper.transactions(req, res, starlingClient, config.personalAccessToken);
    });
    app.get('/api/my/balance', (req, res) => {
      return starlingApiWrapper.balance(req, res, starlingClient, config.personalAccessToken);
    });
    app.get('/api/my/customer', (req, res) => {
      return starlingApiWrapper.customer(req, res, starlingClient, config.personalAccessToken);
    });
  }
};
module.exports = { start };
