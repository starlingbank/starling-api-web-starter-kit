import { injectReducer } from '../../store/reducers';

export default (store) => ({
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const HomeContainer = require('./containers/HomeContainer').default;

      const reducer = require('./modules/home').default;
      injectReducer(store, { key: 'home', reducer });

      cb(null, HomeContainer);
    }, 'home');
  }
});
