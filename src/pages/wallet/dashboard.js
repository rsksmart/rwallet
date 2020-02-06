import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import PropTypes from 'prop-types';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import List from './list';
import AddIndex from './add.index';
import appActions from '../../redux/app/actions';

class Dashboard extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    static callFingerprintVerify() {
      const onAttempt = (error) => {
        console.log(`onAttempt: ${error}`);
        // this.setState({ errorMessage: 'No match' });
      };
      const params = {
        onAttempt,
        description: 'Scan your fingerprint on the device scanner to continue',
      };
      FingerprintScanner
        .authenticate(params)
        .then(() => {
          console.log('fingerprint ok!');
          // this.touchSensor.setModalVisible(false);
          // navigation.state.params.verified();
          // navigation.goBack();
        })
        .catch((error) => {
          console.log(error.message);
          // Alert.alert('try again.');
        });
    }

    constructor(props) {
      super(props);
      this.callAuthVerify = this.callAuthVerify.bind(this);
      this.willFocusSubscription = null;
    }

    async componentDidMount() {
      const { navigation } = this.props;
      this.willFocusSubscription = navigation.addListener(
        'willFocus',
        () => {
          this.callAuthVerify();
        },
      );
    }

    componentWillUnmount() {
      this.willFocusSubscription.remove();
    }

    callAuthVerify() {
      const { wallets, showPasscode, showFingerprintModal } = this.props;
      if (!isEmpty(wallets)) {
        const { isFingerprint } = this.props;
        if ((true || isFingerprint) && FingerprintScanner.isSensorAvailable()) {
          showFingerprintModal();
        } else {
          showPasscode('verify');
        }
      }
    }

    render() {
      const { navigation, wallets } = this.props;
      return isEmpty(wallets) ? <AddIndex navigation={navigation} /> : <List navigation={navigation} />;
    }
}

Dashboard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    pop: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
  wallets: PropTypes.arrayOf(PropTypes.object),
  showPasscode: PropTypes.func.isRequired,
  isFingerprint: PropTypes.bool.isRequired,
  showFingerprintModal: PropTypes.func.isRequired,
};

Dashboard.defaultProps = {
  wallets: undefined,
};

const mapStateToProps = (state) => ({
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
  isFingerprint: state.App.get('fingerprint'),
});

const mapDispatchToProps = (dispatch) => ({
  showPasscode: (category) => dispatch(appActions.showPasscode(category)),
  showFingerprintModal: () => dispatch(appActions.showFingerprintModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
