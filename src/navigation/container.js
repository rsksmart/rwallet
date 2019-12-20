import { connect } from 'react-redux';
import RootComponent from './component';

const mapStateToProps = (state) => ({
  showNotification: state.App.get('showNotification'),
  notification: state.App.get('notification'),
});

export default connect(mapStateToProps)(RootComponent);
