import React from 'react'
import URLSearchParams from 'url-search-params'
import {Loader, Message, Statistic, Grid, Container, Segment, Header, Image, Icon, Label} from 'semantic-ui-react'
import Dashboard from '../../../components/Dashboard/Dashboard'
import './PersonalAccessView.scss'

class PersonalAccessView extends React.Component {

  static propTypes = {
    personalAccess: React.PropTypes.shape({
      transactions: React.PropTypes.array,
      customer: React.PropTypes.object,
      balance: React.PropTypes.object,
      transactionTags: React.PropTypes.object,
      tags: React.PropTypes.array,
      tagSuggestions: React.PropTypes.array
    }),
    loadTransactions: React.PropTypes.func.isRequired,
    loadBalance: React.PropTypes.func.isRequired,
    loadCustomer: React.PropTypes.func.isRequired,
    setLoading: React.PropTypes.func.isRequired,
    getTransactionsTags: React.PropTypes.func.isRequired,
    getTransactionTags: React.PropTypes.func.isRequired,
    addTransactionTag: React.PropTypes.func.isRequired,
    getTags: React.PropTypes.func.isRequired,
    getTagsLike: React.PropTypes.func.isRequired
  };

  componentWillMount () {
    this.props.setLoading(true);
    this.props.loadTransactions();
    this.props.loadCustomer();
    this.props.loadBalance();

    this.props.getTransactionsTags();
    this.props.getTags();
  }

  componentWillUnmount () {
    window.location.href = ('/api/logout')
  }

  render () {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const {loading, transactions, balance, customer, transactionTags, tags, tagSuggestions} = this.props.personalAccess;
    return (
      <Grid>
        <br/>
        {loading ? <Loading/>
          : ( transactions && balance ?
            <Dashboard
              mode={'Personal Access'}
              customer={customer}
              transactions={transactions}
              balance={balance}
              transactionTags={transactionTags}
              tags={tags}
              tagSuggestions={tagSuggestions}
            /> : <AnonymousProfile />)}
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
      <Segment style={{maxWidth: "400px", margin: "50px auto", maxHeight: "200px"}}>
        ERROR
      </Segment>
    </Container>
  );
};

const UserDenied = () => {
  return (
    <Message size="small">
      <Header>User Denied Access</Header>
      <p>When a user denies access Starling will callback with an error code</p>
    </Message>
  );
};

export default PersonalAccessView
