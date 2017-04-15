import React from 'react';
import { Button, Container, Grid, Header, Icon, Label, List, Loader, Segment, Statistic } from 'semantic-ui-react';
import SelectorDropdown from '../../components/SelectorDropdown/SelectorDropdown';
import { Link } from 'react-router';
import { amountDisplay } from '../../commons/utils';
import './Dashboard.scss';
import { array, element, shape, string } from 'prop-types';

class Dashboard extends React.Component {

  static propTypes = {
    balance: shape(),
    transactions: array,
    customer: shape(),
    mode: string.isRequired,
    children: element
  };

  render () {
    const { customer, balance, mode } = this.props;
    const { firstName } = customer;
    const name = customer && firstName ? firstName + '\'s Account' : 'Your Account';

    return <Container style={{ maxWidth: '970px' }}>
      <Grid.Row>
        <Link to="/">
          <Button>{`< Back`}</Button> </Link>
        <Header as="h1" style={{ fontSize: '3rem' }} textAlign="left" content={mode} inverted dividing={true}/>
      </Grid.Row>

      <Header as="h2" style={{ fontSize: '2rem' }} textAlign="left" content={name} inverted/>

      <Grid columns={2} stackable>
        {/*Customer UI*/}
        <Grid.Column>
          <Segment raised style={{ margin: '15px', minHeight: '220px' }}>
            <Label as='a' color='orange' size="huge" ribbon={true}>Account Details</Label>
            <Label as='a' className='tierLabel'>Tier 2</Label>
            <br/>
            {customer ? <CustomerDetails customer={customer}/> : <Loader/>}
          </Segment>
        </Grid.Column>

        {/*Balance UI*/}
        <Grid.Column >
          <Segment raised style={{ margin: '15px', minHeight: '220px' }}>
            <Label color='blue' size="huge" ribbon={true}>Balance</Label>
            <Label className='tierLabel'>Tier 1</Label>
            <Container textAlign="center">
              {balance ? <Balance balance={balance}/> : <Loader/>}
            </Container>
          </Segment>
        </Grid.Column>
      </Grid>

      {/*Transaction UI*/}
      <Container>
        <Segment raised style={{ margin: '0 auto' }}>
          <Label as='a' color='green' size="huge" ribbon={true}>Transactions</Label>
          <Label as='a' className='tierLabel'>Tier 1</Label>
          <SelectorDropdown mode={mode}/>
          <br/>
          { this.props.children || null }
        </Segment>
      </Container>

    </Container>;
  }
}

const Balance = (props) => {
  const { balance } = props;
  if (balance) {

    if (balance.effectiveBalance === undefined && balance.amount) {
      return <OldBalance balance={balance}/>
    }

    const effectiveBalance = balance.effectiveBalance ? amountDisplay(balance.effectiveBalance, balance.currency) : null;
    const clearedBalance = balance.clearedBalance ? amountDisplay(balance.clearedBalance, balance.currency) : null;
    const pendingTransactions = balance.pendingTransactions ? amountDisplay(balance.pendingTransactions, balance.currency) : null;
    return (
      <div>
        <Statistic size="tiny" style={{ textAlign: 'center', marginTop: '-40px' }} color="blue">
          <Icon name="diamond" size="huge" style={{ textAlign: 'center', margin: '10px auto' }}/>
          <Statistic.Value>{effectiveBalance}</Statistic.Value>
          <Statistic.Label>Effective Balance</Statistic.Label>
        </Statistic>
        <Grid columns={2}>
          <Grid.Column>
            <Statistic size="mini" style={{ textAlign: 'center' }} color="blue">
              <Statistic.Value>{clearedBalance}</Statistic.Value>
              <Statistic.Label>Settled Balance</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic size="mini" style={{ textAlign: 'center' }} color="blue">
              <Statistic.Value>{pendingTransactions}</Statistic.Value>
              <Statistic.Label>Pending Txns</Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid>
      </div>
    );
  } else {
    return (
      <div>
        <Header as="h2" icon={true} textAlign="center">
          <Icon name="warning sign" size="large"/>
          Error loading Balance API
        </Header>
      </div>
    )
  }
};

// While the API is different in demo and prod
const OldBalance = ({ balance }) => {
  return balance.amount ? <div>
    <Statistic size="tiny" style={{ textAlign: 'center', marginTop: '-40px' }} color="blue">
      <Icon name="diamond" size="huge" style={{ textAlign: 'center', margin: '10px auto' }}/>
      <Statistic.Value>{balance.amount ? amountDisplay(balance.amount, balance.currency) : null}</Statistic.Value>
      <Statistic.Label>Balance</Statistic.Label>
    </Statistic>
  </div> : null;
};

const CustomerDetails = (props) => {
  const { customer } = props;
  if (customer) {
    const { firstName, lastName, email, phone, dateOfBirth } = customer;
    return (
      <List animated size="large" style={{ margin: '1em 2em' }} verticalAlign="bottom">
        <List.Item>
          <List.Icon name='users'/>
          <List.Content>{firstName + ' ' + lastName}</List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name='phone'/>
          <List.Content>{phone}</List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name='mail'/>
          <List.Content>
            <a href={`mailto:${email}`}>{email}</a>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name='birthday'/>
          <List.Content>
            {dateOfBirth}
          </List.Content>
        </List.Item>
      </List>
    );
  } else {
    return (
      <div>
        <Header as="h2" icon={true} textAlign="center">
          <Icon name="warning sign" size="large"/>
          Error loading Customer API
        </Header>
      </div>
    )
  }
};

export default Dashboard
