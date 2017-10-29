import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: 'oauth',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const OAuthContainer = require('./containers/OAuthContainer').default;
      const reducer = require('./modules/oauth').default;
      injectReducer(store, { key: 'oauth', reducer });

      cb(null, OAuthContainer);
    }, 'oauth');
  }
});

