import { connect } from 'react-redux';
import { loadTransactions, loadBalance, loadCustomer, setLoading, doTransactionFilter } from '../modules/oauth';
import OAuthView from '../views/OAuthView';

const mapDispatchToProps = {
  loadTransactions,
  loadBalance,
  setLoading,
  loadCustomer,
  doTransactionFilter
};

const mapStateToProps = (state) => ({
  oauth: state.oauth
});

export default connect(mapStateToProps, mapDispatchToProps)(OAuthView);
