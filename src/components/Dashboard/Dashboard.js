import React from "react";
import {Grid, Container, Segment, Header, Statistic, Icon, Label, Image, Card, Loader, List, Button} from "semantic-ui-react";
import SelectorDropdown from "../../components/SelectorDropdown/SelectorDropdown";
import { Link } from 'react-router'
import {amountDisplay} from '../../commons/utils'
import './Dashboard.scss'

class Dashboard extends React.Component {

  static propTypes = {
    balance: React.PropTypes.shape(),
    transactions: React.PropTypes.array,
    customer: React.PropTypes.shape(),
    mode: React.PropTypes.string.isRequired,
    children: React.PropTypes.element
  };

  render () {

    const {customer, balance, transactions, mode} = this.props;

    const {firstName} = customer;

    const name = firstName ? firstName + "'s Account" : "Your Account";

    return <div style={{margin: '50px', maxWidth:'970px'}}>
      <Grid.Row>
        <Link to="/"><Button>{`< Back`}</Button></Link>
        <Header as="h1" style={{fontSize: "3rem"}}  textAlign="left" content={mode} inverted dividing={true}/>
      </Grid.Row>

      <Header as="h2" style={{fontSize: "2rem"}} textAlign="left" content={name} inverted/>

      <Grid columns={2}>
        {/*Customer UI*/}
        <Grid.Column>
          <Container style={{margin: '10px 5px 20px 5px'}}>
            <Segment raised style={{maxWidth: '500px', margin: "0 auto", minHeight: "200px"}}>
              <Label as='a' color='orange' size="huge" ribbon={true}>Account Details</Label>
              <Label as='a' className='tierLabel'>Tier 2</Label>
              <br/>
              {customer ? <CustomerDetails customer={customer}/> : <Loader/>}
            </Segment>
          </Container>
        </Grid.Column>

        {/*Balance UI*/}
        <Grid.Column>
          <Container style={{margin: '10px 5px 20px 5px'}}>
            <Segment raised style={{maxWidth: '550px', margin: "0 auto", minHeight: "200px"}}>
              <Label color='blue' size="huge" ribbon={true}>Balance</Label>
              <Label className='tierLabel'>Tier 1</Label>
              <Container textAlign="center">
                {balance ?  <Balance balance={balance}/> : <Loader/>}
              </Container>
            </Segment>
          </Container>
        </Grid.Column>
      </Grid>

      {/*Transaction UI*/}
      <Container>
        <Segment raised>
          <Label as='a' color='green' size="huge" ribbon={true}>Transactions</Label>
          <Label as='a' className='tierLabel'>Tier 1</Label>
            <SelectorDropdown />
            <br/>
            { this.props.children || null }
        </Segment>
      </Container>
    </div>;
  }
}

const Balance = (props) => {
  const displayBalance = amountDisplay(props.balance.amount, props.balance.currency);
  return (
    <Statistic size="small" style={{textAlign: "center", marginTop: "-40px"}} color="blue">
      <Icon name="diamond" size="huge" style={{textAlign: "center", margin: '10px auto'}}/>
      <Statistic.Value>{displayBalance}</Statistic.Value>
      <Statistic.Label>Current Balance</Statistic.Label>
      <br/>
    </Statistic>
  );
};

const CustomerDetails = (props) => {
  const {firstName, lastName, email, phone, dateOfBirth} = props.customer;
  return (
    <List animated size="large" style={{margin: '1em 2em'}} verticalAlign="bottom">
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
};

export default Dashboard
