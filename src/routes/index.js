// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout';
import Home from './Home';
import PersonalAccessRoute from './PersonalAccess';
import OAuthRoute from './OAuth';
import SandboxRoute from './Sandbox';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path        : '/',
  component   : CoreLayout,
  indexRoute  : Home(store),
  childRoutes : [
    PersonalAccessRoute(store),
    OAuthRoute(store),
    SandboxRoute(store)
  ]
});

export default createRoutes;
