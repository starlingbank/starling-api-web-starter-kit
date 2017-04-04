import _ from 'lodash';
import fp from 'lodash/fp';
const debug = require('debug')('app:transactionTagging');
const axios = require('axios');
const persistence = require('./persistence');

export const start = (app) => {

  debug('Starting transaction tagging app...');

  let db;
  const dbRef = persistence.initialise((readyDb) => {
    db = readyDb;
    debug('Transaction tagging app started.');
  });

  const withDb = (req, res, thunk) => {
    if (db) {
      thunk(req, res);
    } else {
      // DB not ready yet
      res.status(503).end();
    }
  };

  /**
   * Add a tag for a transaction.
   */
  app.put('/api/my/transaction-tags/:transactionUid/tags', (req, res) => {
    withDb(req, res, () => {
      const {transactionUid} = req.params;
      const transaction = req.body.transaction;
      const tag = req.body.tag;
      debug('PUT transaction tag', transactionUid, tag);
      persistence.addTransactionTag(db, transaction.transactionUid, transaction.created, tag);
      res.end();
    });
  });

  /**
   * Remove a tag for a transaction.
   */
  app.delete('/api/my/transaction-tags/:transactionUid/tags/:tagName', (req, res) => {
    withDb(req, res, () => {
      const {transactionUid, tagName} = req.params;
      debug('DELETE transaction tag', transactionUid, tagName);
      persistence.removeTransactionTag(db, transaction.transactionUid, tagName);
      res.end();
    });
  });

  /**
   * Get tags for a transaction
   */
  app.get('/api/my/transaction-tags/:transactionUid/tags', (req, res) => {
    withDb(req, res, () => {
      const {transactionUid} = req.params;
      debug('GET transaction tags', transactionUid);
      const transactionTags = persistence.getTransactionTags(db, transactionUid);
      res.json(transactionTags.tags);
    });
  });

  /**
   * Get tags for transactions between given dates.
   */
  app.get('/api/my/transaction-tags', (req, res) => {
    withDb(req, res, () => {
      debug('GET transactions tags');
      // const {fromDate, toDate} = req.query;
      const transactionTags = persistence.getTransactionsTags(db);
      const byUid = _.reduce(transactionTags,  (acc, {transactionUid, created, tags}) => _.assign(acc, { [transactionUid]: tags}), {});
      res.json(byUid);
    });
  });

  /**
   * Get the list of all the tags I have used
   */
  app.get('/api/my/tags', (req, res) => {
    withDb(req, res, () => {
      debug('GET tags');
      res.json(persistence.getTags(db));
    });
  });

  /**
   * Suggest other tags I have used on transactions with the given tag.
   */
  app.get('/api/my/tag-suggestions/:tagName', (req, res) => {
    withDb(req, res, () => {
      const {tagName} = req.params;
      debug('GET tags like', tagName);
      res.json(persistence.getLinkedTags(db, tagName));
    });
  });

};
