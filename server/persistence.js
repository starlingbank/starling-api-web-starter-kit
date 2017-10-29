const _ = require('lodash');
const loki = require('lokijs');
const debug = require('debug')('app:persistence');
const config = require('./config');

// Quick ref to collection references
const transactionTags = (db) => db.getCollection('transactionTags');
const tags = (db) => db.getCollection('tags');
const tagLinks = (db) => db.getCollection('tagLinks');

const getTransactionTags = (db, transactionUid) => {
  return transactionTags(db).findOne({ transactionUid });
};

const getTransactionsTags = (db) => {
  // TODO - query by created date range
  return transactionTags(db).data;
};

const getTags = (db) => _.map(tags(db).data, 'tag');

const getLinkedTags = (db, tag) => {
  return _.map(tagLinks(db).find({ from: tag }), 'to');
};

const addTransactionTag = (db, transactionUid, created, tag) => {
  const coll = transactionTags(db);
  const found = coll.findOne({ transactionUid });
  if (found) {
    // Update
    if (!_.find(found.tags, (t) => t === tag)) {
      coll.update(_.assign({}, found, { tags: _.concat(found.tags, tag) }));
      addTagLinks(db, found.tags, tag);
    }
  } else {
    coll.insert({ transactionUid, created, tags: [ tag ] });
  }

  addTag(db, tag);
};

const removeTransactionTag = (db, transactionUid, tag) => {
  const coll = transactionTags(db);
  const found = coll.findOne({ transactionUid });
  if (found) {
    if (_.find(found.tags, (t) => t === tag)) {
      if (found.tags.length === 1) {
        coll.remove(found);
      } else {
        const updated = _.assign({}, found, { tags: _.without(found.tags, tag) });
        coll.update(updated);
      }
    } else {
      debug('Not removing ', tag, 'from', transactionUid, ' - cannot find tag:', found);
    }
  } else {
    debug('Not removing ', tag, 'from', transactionUid, ' - cannot find tagged transaction');
  }
};

const addTag = (db, tag) => {
  const coll = tags(db);
  const found = coll.findOne({ tag });
  if (!found) {
    coll.insert({ tag });
  }
};

const addTagLinks = (db, existingTags, tag) => {
  const coll = tagLinks(db);
  _.each(existingTags, (t) => {
    addTagLink(coll, t, tag);
    addTagLink(coll, tag, t);
  });
};

const addTagLink = (coll, a, b) => {
  const found = coll.findOne({ $and: [ { from: a }, { to: b } ] });
  if (!found) {
    coll.insert({ from: a, to: b });
  }
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
    /*
     { transactionUid: '...', created: "2017-03-31T07:30:42.068Z", tags: ['...', '...'] }
     */
    collection(db, 'transactionTags');

    /*
     { name: 'food' },
     { name: 'coffee' },
     ...
     */
    collection(db, 'tags');

    /*
     { name: 'food', link: 'breakfast' },
     { name: 'food', link: 'dinner' },
     ...
     */
    collection(db, 'tagLinks');

    cb(db);
  };

  const db = new loki(config.personalTagStore || '../personal-tag-database.json', {
    autoload: true,
    autoloadCallback: autoLoadHandler,
    autosave: true,
    autosaveInterval: 10000
  });

  return db;
};

module.exports = {
  initialise,
  transactionTags,
  tags,
  tagLinks,
  addTransactionTag,
  getTransactionTags,
  getTransactionsTags,
  removeTransactionTag,
  getTags,
  getLinkedTags
};
