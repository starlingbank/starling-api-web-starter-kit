const _ = require('lodash');
const persistence = require('./persistence');

const dbRef = persistence.initialise((db) => {

  const transactionTags = persistence.transactionTags(db);
  const tags = persistence.tags(db);
  const tagLinks = persistence.tagLinks(db);

  transactionTags.clear();
  tags.clear();
  tagLinks.clear();

  const show = (msg, coll) => console.log(msg, coll.data);

  persistence.addTransactionTag(db, 'abc-123', 'datetime', 'food');
  persistence.addTransactionTag(db, 'abc-123', 'datetime', 'breakfast');
  // Ignored
  persistence.addTransactionTag(db, 'abc-123', 'datetime', 'food');

  persistence.addTransactionTag(db, 'abc-456', 'datetime', 'stuff');
  persistence.addTransactionTag(db, 'abc-456', 'datetime', 'lace');

  persistence.addTransactionTag(db, 'abc-789', 'datetime', 'food');
  persistence.addTransactionTag(db, 'abc-789', 'datetime', 'lunch');

  persistence.addTransactionTag(db, 'def-456', 'datetime', 'food');

  show('Transaction tags', transactionTags);
  show('Tags', tags);
  show('Tag links', tagLinks);

  console.log('1 tt', persistence.getTransactionTags(db, 'abc-456'));

  persistence.removeTransactionTag(db, 'abc-456', 'lace');
  console.log('1 tt - removed lace', persistence.getTransactionTags(db, 'abc-456'));
  persistence.removeTransactionTag(db, 'abc-456', 'stuff');
  console.log('1 tt - removed stuff, all gone!', persistence.getTransactionTags(db, 'abc-456'));

  console.log('All tts', persistence.getTransactionsTags(db));

  console.log('All tags', persistence.getTags(db));

  console.log('TLs, breakfast', persistence.getLinkedTags(db, 'breakfast'));
  console.log('TLs, food', persistence.getLinkedTags(db, 'food'));
});
