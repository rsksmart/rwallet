import { connect } from 'react-redux';
import RootComponent from './component';
import appActions from '../redux/app/actions';

const mapStateToProps = (state) => ({
  showNotification: state.App.get('showNotification'),
  notification: state.App.get('notification'),
  showPasscode: state.App.get('showPasscode'),
  passcodeType: state.App.get('passcodeType'),
});

const mapDispatchToProps = (dispatch) => ({
  closePasscodeModal: () => dispatch(appActions.hidePasscode()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootComponent);
