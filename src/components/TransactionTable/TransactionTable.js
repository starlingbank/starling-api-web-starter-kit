import React from 'react';
import _ from 'lodash';
import { amountDisplay, iconClasses, lookup, sourceDisplay } from '../../commons/utils';
import { Icon } from 'semantic-ui-react';
import TransactionTags from './TransactionTags';

export const transactionsProjection = {
  id: { label: 'Id', primaryKey: true },
  sourceIcon: {
    label: '',
    cellStyle: { textAlign: 'center' },
    formatter: (transaction) => <Icon size='large' name={lookup(transaction.source).in(iconClasses).orDefault('pound')}
                                      style={{ textAlign: 'center' }}/>
  },
  narrative: { label: 'Description', cellStyle: { width: '300px' } },
  source: { label: 'Source', formatter: (transaction, source) => lookup(source).in(sourceDisplay).orDefault('Other') },
  amount: {
    label: 'Amount',
    cellClass: 'right-aligned',
    cellStyle: { width: '105px' },
    formatter: ({ currency }, amount) => amountDisplay(amount, currency)
  },
  balance: {
    label: 'Balance',
    cellStyle: { width: '105px' },
    formatter: ({ currency }, balance) => balance ? amountDisplay(balance, currency) : null
  },
  created: {
    label: 'Date',
    formatter: (transaction, created) => <div className='ui label'>
      {new Date(created).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      }).split(' ').join('/')}
    </div>
  }
};

export const transactionsSelection = _.keys(transactionsProjection);

export const transactionsWithTagsProjection = _.assign({}, transactionsProjection, {
  tags: {
    label: 'Tags',
    cellStyle: { width: '400px' },
    formatter: (transaction, __, ___, i, context) => {
      return <TransactionTags transaction={transaction} transactionTags={context.transactionTags} tags={context.tags}
                              tagSuggestions={context.tagSuggestions}/>;
    }
  }
});

export const transactionsWithTagsSelection = [
  'sourceIcon', 'narrative', 'source', 'tags', 'amount', 'balance', 'created'
];
