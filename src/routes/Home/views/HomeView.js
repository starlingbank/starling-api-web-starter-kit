import React from 'react';
import { Button, Container, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

class HomeView extends React.Component {

  static propTypes = {
    setLoading: PropTypes.func.isRequired
  };

  componentWillMount () {
  }

  render () {
    return (
      <Container>
        <Segment raised style={{ marginTop: 'calc(10% + 100px)' }}>
          <Container>
            <Grid relaxed columns={3} stackable divided textAlign='center'>
              <Grid.Row>
                <Grid.Column>
                  <Segment textAlign='center' style={{ border: 'none', boxShadow: 'none' }}>
                    <Header as='h3' icon>
                      <Icon name='users' size='large'/>
                      Production Access
                      <Header.Subheader>
                        Onboard real customers <br/>through the OAuth flow.
                      </Header.Subheader>
                    </Header>
                    <br/>
                    <Link to='/oauth'>
                      <Button color='green'>Enter</Button>
                    </Link>
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment textAlign='center' style={{ border: 'none', boxShadow: 'none' }}>
                    <Header as='h3' icon>
                      <Icon name='code' size='large'/>
                      Sandbox Access
                      <Header.Subheader>
                        Test your application with <br/>your sandbox customers.
                      </Header.Subheader>
                    </Header>
                    <br/>
                    <Link to='/sandbox'>
                      <Button color='orange'>Enter</Button>
                    </Link></Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment textAlign='center' style={{ border: 'none', boxShadow: 'none' }}>
                    <Header as='h3' icon>
                      <Icon name='home' size='large'/>
                      Personal Access
                      <Header.Subheader>
                        View your own account <br/>and transaction data.
                      </Header.Subheader>
                    </Header><br/>
                    <Link to='/personal'>
                      <Button color='blue'>Enter</Button>
                    </Link></Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </Container>
    );
  }
}

export default HomeView;
