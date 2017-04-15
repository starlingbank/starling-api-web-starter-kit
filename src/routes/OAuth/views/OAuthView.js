import React from 'react'
import URLSearchParams from 'url-search-params'
import {Loader, Message, Statistic, Grid, Container, Segment, Header, Image, Icon, Label, Button} from 'semantic-ui-react'
import connect from '../../../assets/Oauth-button.png'
import Dashboard from '../../../components/Dashboard/Dashboard'
import { Link } from 'react-router'
import UserDenied from '../../../components/UserDenied/UserDenied'
import QuickTable from '../../../components/QuickTable';
import { func } from 'prop-types';

import {transactionsProjection, transactionsSelection} from '../../../components/TransactionTable/TransactionTable';

const onConnectStarling = () => {
  window.location.href = '/api/oauth/login';
};

class OAuthView extends React.Component {

  static propTypes = {
    loadTransactions: func.isRequired,
    loadBalance: func.isRequired,
    loadCustomer: func.isRequired,
    setLoading: func.isRequired,
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
    const {loading, transactions, balance, customer} = this.props.oauth;
    return (
      <Grid>
        <br/>
        {loading ? <Loading/>
          : ( transactions && balance && customer ?
            <Dashboard mode={'Production'} customer={customer} transactions={transactions} balance={balance}>
              <QuickTable projection={transactionsProjection} selection={transactionsSelection} items={transactions} />
            </Dashboard> : <AnonymousProfile />)}
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
      <Segment style={{maxWidth: "400px", margin: "50px auto", maxHeight: "200px"}}>
        <Label as='a' color='purple' size="large" ribbon={true}>Sign In</Label>
    <Image src={connect}
           className='connect-button'
           height='75'
           alt='oauth-button'
           onClick={onConnectStarling}/>
      </Segment>
    </Container>
  );
};

export default OAuthView
