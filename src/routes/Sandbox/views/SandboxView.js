import React from 'react';
import URLSearchParams from 'url-search-params';
import { Button, Container, Grid, Header, Icon, Loader, Segment } from 'semantic-ui-react';
import Dashboard from '../../../components/Dashboard/Dashboard';
import { Link } from 'react-router';
import UserDenied from '../../../components/UserDenied/UserDenied';
import QuickTable from '../../../components/QuickTable';
import { func} from 'prop-types';
import { transactionsProjection, transactionsSelection } from '../../../components/TransactionTable/TransactionTable';

class SandboxView extends React.Component {

  static propTypes = {
    loadTransactions: func.isRequired,
    loadBalance: func.isRequired,
    loadCustomer: func.isRequired,
    setLoading: func.isRequired
  };

  componentWillMount () {
    this.props.setLoading(true);
    this.props.loadTransactions();
    this.props.loadCustomer();
    this.props.loadBalance();
  }

  componentWillUnmount () {
    window.location.href = ('/api/logout')
  }

  render () {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const { transactions, balance, customer, loading } = this.props.sandbox;
    console.log(transactions, balance, customer, loading);
    return (
      <Grid>
        <br/>
        {loading ? <Loading/>
          : ( transactions && balance ?
              <Dashboard mode={'Sandbox'} customer={customer} transactions={transactions} balance={balance}>
                <QuickTable projection={transactionsProjection} selection={transactionsSelection} items={transactions}/>
              </Dashboard> :
              <AnonymousProfile />)}
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

const AnonymousProfile = () => {
  return (
    <Container>
      <Link to="/">
        <Button>{`< Back`}</Button> </Link>
      <Segment size="large" textAlign="center" style={{maxWidth: '500px', margin: '40px auto'}}>
        <Header as="h2" icon={true}>
          <Icon name="warning sign"/>
          Access Denied
          <Header.Subheader>
            Check the sandbox refresh token in the server config is valid and try again.
          </Header.Subheader>
        </Header>
      </Segment>
    </Container>

  );
};

export default SandboxView
