import _ from 'lodash';
import { connect } from 'react-redux';
import {
  addTransactionTag,
  getTags,
  getTagsLike,
  getTransactionsTags,
  getTransactionTags,
  loadBalance,
  loadCustomer,
  loadTransactions,
  setLoading
} from '../modules/personalAccess';
import PersonalAccessView from '../views/PersonalAccessView';

const mapDispatchToProps = {
  loadTransactions,
  loadBalance,
  setLoading,
  loadCustomer,
  getTransactionsTags,
  getTransactionTags,
  addTransactionTag,
  getTags,
  getTagsLike
};

const mapStateToProps = (state) => _.pick(state, 'personalAccess');

export default connect(mapStateToProps, mapDispatchToProps)(PersonalAccessView);
