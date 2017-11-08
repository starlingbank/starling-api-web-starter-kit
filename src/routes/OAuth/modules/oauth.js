import { getBalance, getCustomer, getTransactions } from '../../../service/oauthApiService';
import { createAction, handleActions } from 'redux-actions';

// ------------------------------------
// Constants
// ------------------------------------
const RETRIEVED_TRANSACTIONS = 'RETRIEVED_TRANSACTIONS';
const RETRIEVED_BALANCE = 'RETRIEVED_BALANCE';
const RETRIEVED_CUSTOMER = 'RETRIEVED_CUSTOMER';
const LOADING = 'LOADING';

const loaderDelay = 500;
// ------------------------------------
// Actions
// ------------------------------------
const retrievedTransactions = createAction(RETRIEVED_TRANSACTIONS);
const retrievedBalance = createAction(RETRIEVED_BALANCE);
const retrievedCustomer = createAction(RETRIEVED_CUSTOMER);
const loadingAction = createAction(LOADING);

export const loadTransactions = (source, from, to) => {
  return dispatch => {
    getTransactions(source, from, to)
      .then(transactionResponse => {
        dispatch(retrievedTransactions(transactionResponse.data));
        setTimeout(() => dispatch(setLoading(false)), loaderDelay);
      })
      .catch(() => {
        setTimeout(() => dispatch(setLoading(false)), loaderDelay);
      });
  };
};

export const loadBalance = () => {
  return dispatch => {
    getBalance()
      .then(balanceResponse => {
        dispatch(retrievedBalance(balanceResponse.data));
        setTimeout(() => dispatch(setLoading(false)), loaderDelay);
      })
      .catch((e) => {
        console.log(e);
        setTimeout(() => dispatch(setLoading(false)), loaderDelay);
      });
  };
};

export const loadCustomer = () => {
  return dispatch => {
    getCustomer()
      .then(customerResponse => {
        dispatch(retrievedCustomer(customerResponse.data));
        setTimeout(() => dispatch(setLoading(false)), loaderDelay);
      })
      .catch((e) => {
        console.log(e);
        setTimeout(() => dispatch(setLoading(false)), loaderDelay);
      });
  };
};

export const doOAuthTransactionFilter = (source) => {
  return dispatch => {
    getTransactions(source)
      .then(transactionResponse => {
        dispatch(retrievedTransactions(transactionResponse.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };
};

export const setLoading = (isLoading) => {
  return dispatch => {
    dispatch(loadingAction(isLoading));
  };
};

// ------------------------------------
// Action Handlers
// ------------------------------------

const initialState = {
  transactions: undefined,
  balance: undefined,
  customer: undefined,
  loading: false
};

export default handleActions({
  [RETRIEVED_TRANSACTIONS]: (state, action) => {
    return Object.assign({}, state, { transactions: action.payload });
  },
  [RETRIEVED_BALANCE]: (state, action) => {
    return Object.assign({}, state, { balance: action.payload });
  },
  [RETRIEVED_CUSTOMER]: (state, action) => {
    return Object.assign({}, state, { customer: action.payload });
  },
  [LOADING]: (state, action) => {
    return Object.assign({}, state, { loading: action.payload });
  }
}, initialState);
