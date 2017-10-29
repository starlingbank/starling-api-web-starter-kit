import React, { Component } from 'react';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';
import { object } from 'prop-types';
import 'react-select/dist/react-select.css';

class AppContainer extends Component {
  static propTypes = {
    routes: object.isRequired,
    store: object.isRequired
  };

  shouldComponentUpdate () {
    return false;
  }

  render () {
    const { routes, store } = this.props;

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={browserHistory}>
            {routes}
          </Router>
        </div>
      </Provider>
    );
  }
}

export default AppContainer;
