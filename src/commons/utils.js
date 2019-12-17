export const currencySymbols = {
  GBP: '£',
  USD: '$',
  EUR: '€'
};

export const iconClasses = {
  MASTER_CARD: 'credit card',
  FASTER_PAYMENTS_OUT: 'sign out',
  FASTER_PAYMENTS_IN: 'sign in',
  STARLING_PAY_STRIPE: 'money bill alternate outline',
  STRIPE_FUNDING: 'plus',
  INTERNAL_TRANSFER: 'exchange',
  INTEREST_PAYMENT: 'percent',
  DIRECT_DEBIT: 'building',
  DIRECT_CREDIT: 'building'
};

export const sourceDisplay = {
  MASTER_CARD: 'Card',
  FASTER_PAYMENTS_OUT: 'Outbound Payment',
  FASTER_PAYMENTS_IN: 'Inbound Payment',
  STARLING_PAY_STRIPE: 'Settle Up',
  STRIPE_FUNDING: 'Account Funded',
  INTERNAL_TRANSFER: 'Internal Transfer',
  INTEREST_PAYMENT: 'Interest',
  DIRECT_DEBIT: 'Direct Debit',
  DIRECT_CREDIT: 'Direct Credit',
  CHEQUE: 'Cheque Deposit',
  CICS_CHEQUE: 'Cheque Deposit'
};

export const lookup = key => {
  return {
    in: map => {
      return {
        orDefault: value => {
          return map[key] || value;
        }
      };
    }
  };
};

export const amountDisplay = ({ minorUnits, currency }) => {
  const currencySymbol = lookup(currency).in(currencySymbols).orDefault('£');
  if (minorUnits < 0) {
    return '-' + currencySymbol + (-minorUnits/100).toFixed(2).toString();
  } else {
    return currencySymbol + (minorUnits/100).toFixed(2).toString();
  }
};

import _ from 'lodash';

export const joinClasses = (...classes) => {
  const nonBlank = _.filter(classes, (clazz) => !!clazz);
  return _.join(nonBlank, ' ');
};

export const defaultTo = (fn, def) => (a, b, c, d, e, f, g) => fn(a, b, c, d, e, f, g) || def;
