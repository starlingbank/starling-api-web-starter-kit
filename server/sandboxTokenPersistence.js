const _ = require('lodash');
const loki = require('lokijs');
const debug = require('debug')('app:persistence');
const config = require('./config');

const SANDBOX_TOKEN_COLLECTION = 'sandboxTokens';
const sandboxTokens = (db) => db.getCollection(SANDBOX_TOKEN_COLLECTION);
const getSandboxTokens = (db) => sandboxTokens(db).findOne();
const setSandboxTokens = (db, tokens) => {
  const coll = sandboxTokens(db);
  coll.clear();
  coll.insert(tokens);
};

const collection = (db, name) => {
  let coll = db.getCollection(name);
  if (coll === null) {
    coll = db.addCollection(name);
  }
  return coll;
};

const initialise = (cb) => {

  const autoLoadHandler = () => {
    collection(db, SANDBOX_TOKEN_COLLECTION);
    cb(db);
  };

  const db = new loki(config.sandboxLocalTokenStore || '../starling-api-web-starter-kit-sandbox-token-store.json', {
    autoload: true,
    autoloadCallback: autoLoadHandler,
    autosave: true,
    autosaveInterval: 10000
  });

  return db;
};

module.exports = { initialise, getSandboxTokens, setSandboxTokens };
