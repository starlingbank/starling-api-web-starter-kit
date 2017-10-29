import _ from 'lodash';
import { getBalance, getCustomer, getTransactions } from '../../../service/personalApiService';
import {
  addTransactionTag as addTransactionTagService,
  getTags as getTagsService,
  getTagsLike as getTagsLikeService,
  getTransactionsTags as getTransactionsTagsService,
  getTransactionTags as getTransactionTagsService,
  removeTransactionTag as removeTransactionTagService
} from '../../../service/transactionTaggingService';
import { createAction, handleActions } from 'redux-actions';

const GOT_TRANSACTIONS_TAGS = 'GOT_TRANSACTIONS_TAGS';
const GOT_TRANSACTION_TAGS = 'GOT_TRANSACTION_TAGS';
const GOT_TAGS = 'GOT_TAGS';
const GOT_TAGS_LIKE = 'GOT_TAGS_LIKE';

const gotTransactionsTags = createAction(GOT_TRANSACTIONS_TAGS);
const gotTransactionTags = createAction(GOT_TRANSACTION_TAGS);
const gotTags = createAction(GOT_TAGS);
const gotTagsLike = createAction(GOT_TAGS_LIKE);

// TODO - Cascade the delete into the tags and tagSuggestions collections too
export const deleteTransactionTag = (transaction, tagToRemove) => (dispatch) => {
  return removeTransactionTagService(transaction, tagToRemove)
    .then(() => dispatch(getTransactionTags(transaction)))
    .catch((err) => console.error('Erorr removing tag from  transaction', transaction, tagToRemove, err));
};

export const addTransactionTag = (transaction, tagToAdd) => (dispatch) => {
  return addTransactionTagService(transaction, tagToAdd)
    .then(() => {
      dispatch(getTransactionTags(transaction));
      dispatch(getTags(tagToAdd));
    })
    .catch((err) => console.error('Erorr adding tag to transaction', transaction, tagToAdd, err));
};

export const getTransactionsTags = () => (dispatch) => {
  return getTransactionsTagsService()
    .then((json) => dispatch(gotTransactionsTags(json)))
    .catch((err) => console.error('Error getting transaction tags', err));
};

export const getTransactionTags = (transaction) => (dispatch) => {
  return getTransactionTagsService(transaction)
    .then((json) => dispatch(gotTransactionTags({ transaction, latestTransactionTags: json })))
    .catch((err) => console.error('Error getting transaction tags', transaction, err));
};

export const getTags = (newTag) => (dispatch, getState) => {
  const existingTags = getState().personalAccess.tags;
  console.debug('getTags :: existingTags is', existingTags, 'new tag to add is', newTag);
  if (existingTags.indexOf(newTag) === -1) {
    return getTagsService()
      .then((json) => dispatch(gotTags(json)))
      .catch((err) => console.error('Error getting tags', err));
  }
};

// TODO - use this - async load this when tags selector is focussed
// TODO - build a cache of these and update it in arrears asyncly
export const getTagsLike = (tag) => (dispatch) => {
  return getTagsLikeService(tag)
    .then((json) => dispatch(gotTagsLike(json)))
    .catch((err) => console.error('Error getting tags like', tag, err));
};

const loaderDelay = 500;

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

export const doPersonalTransactionFilter = (source) => {
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
  loading: false,
  transactionTags: {},
  tags: [],
  tagSuggestions: []
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
  },
  [GOT_TRANSACTIONS_TAGS]: (state, action) => {
    console.debug('GOT_TRANSACTIONS_TAGS', action.payload);
    return Object.assign({}, state, { transactionTags: action.payload });
  },
  [GOT_TRANSACTION_TAGS]: (state, action) => {
    console.debug('GOT_TRANSACTION_TAGS reducing payload', action.payload);
    if (action.payload.latestTransactionTags) {
      const { transactionUid } = action.payload.latestTransactionTags;
      console.debug('updating transactiontag with new tag set');
      return Object.assign({}, state, {
        transactionTags: _.assign({}, state.transactionTags, {
          [transactionUid]: action.payload.latestTransactionTags.tags
        })
      });
    } else {
      // Remove it
      console.debug('removing transactiontag now having 0 tags');
      return Object.assign({}, state, {
        transactionTags: _.omit(state.transactionTags, action.payload.transaction.transactionUid)
      });
    }
  },
  [GOT_TAGS]: (state, action) => {
    console.debug('GOT_TAGS', action.payload);
    return Object.assign({}, state, { tags: action.payload });
  },
  [GOT_TAGS_LIKE]: (state, action) => {
    console.debug('GOT_TAGS_LIKE', action.payload);
    return Object.assign({}, state, { tagSuggestions: action.payload });
  }
}, initialState);
