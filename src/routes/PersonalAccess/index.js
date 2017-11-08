import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path : 'personal',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const PersonalAccessContainer = require('./containers/PersonalAccessContainer').default;

      const reducer = require('./modules/personalAccess').default;
      injectReducer(store, { key: 'personalAccess', reducer });

      cb(null, PersonalAccessContainer);
    }, 'personal');
  }
});
