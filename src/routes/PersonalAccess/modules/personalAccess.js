import {getBalance, getTransactions, getCustomer} from '../../../service/personalApiService';
import {addTransactionTag as addTransactionTagService,
        removeTransactionTag as removeTransactionTagService,
        getTransactionTags as getTransactionTagsService,
        getTransactionsTags as getTransactionsTagsService,
        getTags as getTagsService,
        getTagsLike as getTagsLikeService} from '../../../service/transactionTaggingService';
import {handleActions, createAction} from 'redux-actions';
import {sourceUrlEncode} from '../../../commons/utils';

const GOT_TRANSACTIONS_TAGS = 'GOT_TRANSACTIONS_TAGS';
const GOT_TRANSACTION_TAGS = 'GOT_TRANSACTION_TAGS';
const GOT_TAGS = 'GOT_TAGS';
const GOT_TAGS_LIKE = 'GOT_TAGS_LIKE';

const gotTransactionsTags = createAction(GOT_TRANSACTIONS_TAGS);
const gotTransactionTags = createAction(GOT_TRANSACTION_TAGS);
const gotTags = createAction(GOT_TAGS);
const gotTagsLike = createAction(GOT_TAGS_LIKE);

export const deleteTransactionTag = (transaction, tagToRemove) => (dispatch) => {
  return removeTransactionTagService(transaction, tagToRemove)
    .then(() => dispatch(getTransactionTags(transaction)))
    .catch((err) => console.error('Erorr removing tag from  transaction', transaction, tagToRemove, err));
};

export const addTransactionTag = (transaction, tagToAdd) => (dispatch) => {
  return addTransactionTagService(transaction, tagToAdd)
    .then(() => dispatch(getTransactionTags(transaction))) // TODO - update the tags too
    .catch((err) => console.error('Erorr adding tag to transaction', transaction, tagToAdd, err));
};

export const getTransactionsTags = () => (dispatch) => {
  return getTransactionsTagsService()
    .then((json) => dispatch(gotTransactionsTags(json)))
    .catch((err) => console.error('Error getting transaction tags', transaction, err));
};

export const getTransactionTags = (transaction) => (dispatch) => {
  return getTransactionTagsService(transaction)
    .then((json) => dispatch(gotTransactionTags(json)))
    .catch((err) => console.error('Error getting transaction tags', transaction, err));
};

// TODO - Call this from addTransactionTag with optional arg, the new tag, and only actually fetch the tag list if the new tag is not already in the list we have cached here
export const getTags = () => (dispatch) => {
  return getTagsService()
    .then((json) => dispatch(gotTags(json)))
    .catch((err) => console.error('Error getting tags', err));
};

// TODO - use this - async load this when tags selector is focussed
// TODO - build a cache of these and update it in arrears asyncly
export const getTagsLike = (tag) => (dispatch) => {
  return getTagsLikeService(tag)
    .then((json) => dispatch(gotTagsLike(json)))
    .catch((err) => console.error('Error getting tags like', tag, err));
};

const loaderDelay = 100;

// ------------------------------------
// Constants
// ------------------------------------
const RETRIEVED_TRANSACTIONS = 'RETRIEVED_TRANSACTIONS';
const RETRIEVED_BALANCE = 'RETRIEVED_BALANCE';
const RETRIEVED_CUSTOMER = 'RETRIEVED_CUSTOMER';
const LOADING = 'LOADING';

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
        setTimeout(() => dispatch(setLoading(false)), loaderDelay)
      })
      .catch(() => {
        setTimeout(() => dispatch(setLoading(false)), loaderDelay)
      });
  }
};

export const loadBalance = () => {
  return dispatch => {
    getBalance()
      .then(balanceResponse => {
        dispatch(retrievedBalance(balanceResponse.data));
        setTimeout(() => dispatch(setLoading(false)), loaderDelay)
      })
      .catch((e) => {
        console.log(e);
        setTimeout(() => dispatch(setLoading(false)), loaderDelay)
      });
  }
};

export const loadCustomer = () => {
  return dispatch => {
    getCustomer()
      .then(customerResponse => {
        dispatch(retrievedCustomer(customerResponse.data));
        setTimeout(() => dispatch(setLoading(false)), loaderDelay)
      })
      .catch((e) => {
        console.log(e);
        setTimeout(() => dispatch(setLoading(false)), loaderDelay)
      });
  }
};

export const doTransactionFilter = (source) => {
  return dispatch => {
    getTransactions(source)
      .then(transactionResponse => {
        dispatch(retrievedTransactions(transactionResponse.data));
      })
      .catch((e) => {
        console.log(e);
      });
  }
};

export const setLoading = (isLoading) => {
  return dispatch => {
    dispatch(loadingAction(isLoading))
  }
};

// ------------------------------------
// Action Handlers
// ------------------------------------

const initialState = {
  transactions: undefined,
  balance: undefined,
  customer: undefined,
  loading: false,
  transactionTags: {},
  tags: [],
  tagSuggestions: []
};

export default handleActions({
  [RETRIEVED_TRANSACTIONS]: (state, action) => {
    return Object.assign({}, state, {transactions: action.payload});
  },
  [RETRIEVED_BALANCE]: (state, action) => {
    return Object.assign({}, state, {balance: action.payload});
  },
  [RETRIEVED_CUSTOMER]: (state, action) => {
    return Object.assign({}, state, {customer: action.payload});
  },
  [LOADING]: (state, action) => {
    return Object.assign({}, state, {loading: action.payload});
  },
  [GOT_TRANSACTIONS_TAGS]:  (state, action) => {
    console.debug('GOT_TRANSACTIONS_TAGS', action.payload);
    return Object.assign({}, state, {transactionTags: action.payload});
  },
  // TODO - update the store's list of tags for the given transaction
  [GOT_TRANSACTION_TAGS]: (state, action) => {
    console.debug('GOT_TRANSACTION_TAGS', action.payload);
    return state;
  },
  [GOT_TAGS]: (state, action) => {
    console.debug('GOT_TAGS', action.payload);
    return Object.assign({}, state, {tags: action.payload});
  },
  [GOT_TAGS_LIKE]: (state, action) => {
    console.debug('GOT_TAGS_LIKE', action.payload);
    return Object.assign({}, state, {tagSuggestions: action.payload});
  }
}, initialState);
