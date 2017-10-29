import _ from 'lodash';
import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { addTransactionTag, deleteTransactionTag } from '../../routes/PersonalAccess/modules/personalAccess';

const handleOnChange = (transaction, existingTags, dispatch) => (updatedTags) => {
  const a = new Set(existingTags);
  const b = new Set(_.map(updatedTags, 'value'));
  const toRemove = new Set([ ...a ].filter(x => !b.has(x))); // in a, not in b
  const toAdd = new Set([ ...b ].filter(x => !a.has(x))); // in b, not in a

  // console.debug('Handling tag change :: existing', existingTags, 'updated', _.map(updatedTags, 'value'), 'toRemove',
  // toRemove, 'toAdd', toAdd);
  toRemove.forEach((r) => {
    dispatch(deleteTransactionTag({ transactionUid: transaction.id }, r));
  });
  toAdd.forEach((r) => {
    dispatch(addTransactionTag({ transactionUid: transaction.id, created: transaction.created }, r));
  });
};

export const TransactionTags = (props) => {
  const { dispatch, transaction, transactionTags, tags } = props;
  const existingTags = transactionTags ? transactionTags[ transaction.id ] : [];
  const options = tags.map((tag) => ({ label: tag, value: tag }));
  const onChange = handleOnChange(transaction, existingTags, dispatch);
  return <Select.Creatable
    options={options}
    onChange={onChange}
    value={existingTags} multi />;
};

export default connect()(TransactionTags);
