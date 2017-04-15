import React from 'react';
import URLSearchParams from 'url-search-params';
import { Button, Container, Grid, Header, Icon, Loader, Segment } from 'semantic-ui-react';
import Dashboard from '../../../components/Dashboard/Dashboard';
import UserDenied from '../../../components/UserDenied/UserDenied';
import { Link } from 'react-router';
import './PersonalAccessView.scss';
import QuickTable from '../../../components/QuickTable';
import { array, bool, func, object, shape } from 'prop-types';
import {
  transactionsWithTagsProjection,
  transactionsWithTagsSelection
} from '../../../components/TransactionTable/TransactionTable';

class PersonalAccessView extends React.Component {

  static propTypes = {
    personalAccess: shape({
      transactions: array,
      customer: object,
      balance: object,
      loading: bool,
      transactionTags: object,
      tags: array,
      tagSuggestions: array
    }).isRequired,
    loadTransactions: func.isRequired,
    loadBalance: func.isRequired,
    loadCustomer: func.isRequired,
    setLoading: func.isRequired,
    getTransactionsTags: func.isRequired,
    getTransactionTags: func.isRequired,
    addTransactionTag: func.isRequired,
    getTags: func.isRequired,
    getTagsLike: func.isRequired
  };

  componentWillMount () {
    this.props.loadTransactions();
    this.props.loadCustomer();
    this.props.loadBalance();
    this.props.setLoading(true);
    this.props.getTransactionsTags();
    this.props.getTags();
  }

  componentWillUnmount () {
    window.location.href = ('/api/logout')
  }

  renderDashboard () {
    const { transactions, balance, customer, transactionTags, tags, tagSuggestions } = this.props.personalAccess;
    if (balance && transactions && customer) {
      return <Dashboard
        mode={'Personal Access'}
        customer={customer}
        transactions={transactions}
        balance={balance}>
        { transactions.length
          ? <QuickTable
            projection={transactionsWithTagsProjection}
            selection={transactionsWithTagsSelection}
            items={transactions}
            context={{ transactionTags, tags, tagSuggestions }}/>
          : <p>No transactions on record.</p> }
      </Dashboard>;
    } else {
      return <AnonymousProfile/>
    }
  }

  render () {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const { loading } = this.props.personalAccess;
    return (
      <Grid>
        <br/>
        {loading ? <Loading/> : this.renderDashboard() }
        {error && error === 'access_denied' ? <UserDenied/> : null}
      </Grid>
    )
  }
}

const Loading = () => {
  return (
    <Loader active size="large"/>
  );
};

// TODO - Not clear when to use this. Presumably if we get 400s back from server when requesting
// customer/balance/transactions. Feels like we need richer redux store / app state to represent this scenario
const AnonymousProfile = () => {
  return (
    <Container>
      <Link to="/"><Button>{`< Back`}</Button> </Link>
      <Segment size="large" textAlign="center" style={{maxWidth: '500px', margin: '40px auto'}}>
        <Header as="h2" icon={true}>
          <Icon name="warning sign"/>
          Access Denied
          <Header.Subheader>
            Check your personal access token in the server config is valid and try again.
          </Header.Subheader>
        </Header>
      </Segment>
    </Container>
  );
};

export default PersonalAccessView
