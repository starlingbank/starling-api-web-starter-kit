import { handleActions, createAction } from 'redux-actions';

// ------------------------------------
// Constants
// ------------------------------------
const LOADING = 'LOADING';
// ------------------------------------
// Actions
// ------------------------------------
const loadingAction = createAction(LOADING);

export const setLoading = (isLoading) => {
  return dispatch => {
    dispatch(loadingAction(isLoading));
  };
};

// ------------------------------------
// Action Handlers
// ------------------------------------

const initialState = {
  loading: false
};

export default handleActions({
  [LOADING]: (state, action) => {
    return Object.assign({}, state, { loading: action.payload });
  }
}, initialState);
