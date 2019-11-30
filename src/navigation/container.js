import { connect } from 'react-redux';
import RootComponent from './component';

const mapStateToProps = (state) => ({
  notifications: state.App.get('notifications'),
});

export default connect(mapStateToProps)(RootComponent);
