import _ from 'lodash';
import {connect} from 'react-redux'
import {loadTransactions, loadBalance, loadCustomer, setLoading, doTransactionFilter} from '../modules/personalAccess'
import {getTransactionsTags, getTransactionTags, addTransactionTag, getTags, getTagsLike} from '../modules/personalAccess'
import PersonalAccessView from '../views/PersonalAccessView'

const mapDispatchToProps = {
  loadTransactions,
  loadBalance,
  setLoading,
  loadCustomer,
  doTransactionFilter,

  getTransactionsTags,
  getTransactionTags,
  addTransactionTag,
  getTags,
  getTagsLike
};

const mapStateToProps = (state) => _.pick(state, 'personalAccess');

export default connect(mapStateToProps, mapDispatchToProps)(PersonalAccessView)
