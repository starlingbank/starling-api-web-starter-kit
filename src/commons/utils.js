export const sourceUrlEncode = (source) => {
  if (source === 'MASTER_CARD' || source === 'mastercard') {
    return '/mastercard';
  } else if (source === 'FASTER_PAYMENTS_IN' || source === 'fps/in') {
    return '/fps/in';
  } else if (source === 'FASTER_PAYMENTS_OUT' || source === 'fps/out') {
    return '/fps/out';
  } else if (source === 'DIRECT_DEBIT' || source === 'direct-debit') {
    return '/direct-debit';
  } else {
    return ''
  }
};

export const currencySymbols = {
  GBP: '£',
  USD: '$',
  EUR: "€"
};

export const iconClasses = {
  MASTER_CARD: 'credit card alternative',
  FASTER_PAYMENTS_OUT: 'send',
  FASTER_PAYMENTS_IN: 'gift',
  STRIPE_FUNDING: 'plus',
  INTEREST_PAYMENT: 'diamond',
  DIRECT_DEBIT: 'building'
};

export const sourceDisplay = {
  MASTER_CARD: 'Card',
  FASTER_PAYMENTS_OUT: 'Outbound Payment',
  FASTER_PAYMENTS_IN: 'Inbound Payment',
  STRIPE_FUNDING: 'Account Funded',
  INTEREST_PAYMENT: 'Interest',
  DIRECT_DEBIT: 'Direct Debit'
};

export const lookup = key => {
  return {
    in: map => {
      return {
        orDefault: value => {
          return map[key] || value;
        }
      }
    }
  }
};

export const amountDisplay = (amount, currency) => {
  const currencySymbol = lookup(currency).in(currencySymbols).orDefault('£');
    if (amount < 0) {
      return '-' + currencySymbol + (-amount).toFixed(2).toString();
    } else {
      return currencySymbol + (amount).toFixed(2).toString();
    }
};

import _ from 'lodash';

export const joinClasses = (...classes) => {
  const nonBlank = _.filter(classes, (clazz) => !!clazz);
  return _.join(nonBlank, ' ');
};

export const defaultTo = (fn, def) => (a, b, c, d, e, f, g) => fn(a, b, c, d, e, f, g) || def;
