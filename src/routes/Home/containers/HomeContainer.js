import { connect } from 'react-redux';
import { setLoading } from '../modules/home';
import HomeView from '../views/HomeView';

const mapDispatchToProps = {
  setLoading
};

const mapStateToProps = (state) => ({
  home: state.home
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
