import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: 'sandbox',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const SandboxContainer = require('./containers/SandboxContainer').default;
      const reducer = require('./modules/sandbox').default;
      injectReducer(store, { key: 'sandbox', reducer });

      cb(null, SandboxContainer);
    }, 'sandbox');
  }
});

