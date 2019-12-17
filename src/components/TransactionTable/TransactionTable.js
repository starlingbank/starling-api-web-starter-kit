import React from 'react';
import _ from 'lodash';
import { amountDisplay, iconClasses, lookup, sourceDisplay } from '../../commons/utils';
import { Icon } from 'semantic-ui-react';
import TransactionTags from './TransactionTags';

export const transactionsProjection = {
  feedItemUid: { label: 'ID', primaryKey: true },
  sourceIcon: {
    label: '',
    cellStyle: { textAlign: 'center' },
    formatter: (transaction) => <Icon size='large' name={lookup(transaction.source).in(iconClasses).orDefault('pound')}
                                      style={{ textAlign: 'center' }}/>
  },
  counterPartyName: { label: 'Description', cellStyle: { minWidth: '300px' } },
  source: { label: 'Source', formatter: (transaction, source) => lookup(source).in(sourceDisplay).orDefault('Other') },
  amount: {
    label: 'Amount',
    cellClass: 'right-aligned',
    formatter: (transaction, amount) => amountDisplay(amount)
  },
  transactionTime: {
    label: 'Date',
    formatter: (transaction, transactionTime) => <div className='ui label'>
      {new Date(transactionTime).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      }).split(' ').join('/')}
    </div>
  }
};

export const transactionsSelection = _.keys(transactionsProjection).filter(fieldName => !fieldName.includes("Uid"));

export const transactionsWithTagsProjection = _.assign({}, transactionsProjection, {
  tags: {
    label: 'Tags',
    cellStyle: { minWidth: '300px' },
    formatter: (transaction, __, ___, i, context) => {
      return <TransactionTags transaction={transaction} transactionTags={context.transactionTags} tags={context.tags}
                              tagSuggestions={context.tagSuggestions}/>;
    }
  }
});

export const transactionsWithTagsSelection = [...transactionsSelection, 'tags'];
