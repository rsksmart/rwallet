import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import PropTypes from 'prop-types';
import List from './list';
import AddIndex from './add.index';
import appActions from '../../redux/app/actions';

class Dashboard extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.doAuthVerify = this.doAuthVerify.bind(this);
      this.willFocusSubscription = null;
    }

    async componentDidMount() {
      const { navigation } = this.props;
      this.willFocusSubscription = navigation.addListener(
        'willFocus',
        () => {
          this.doAuthVerify();
        },
      );
    }

    componentWillUnmount() {
      this.willFocusSubscription.remove();
    }

    doAuthVerify() {
      const { wallets, callAuthVerify } = this.props;
      if (!isEmpty(wallets)) {
        callAuthVerify();
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
  callAuthVerify: PropTypes.func.isRequired,
};

Dashboard.defaultProps = {
  wallets: undefined,
};

const mapStateToProps = (state) => ({
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
  // isFingerprint: state.App.get('fingerprint'),
});

const mapDispatchToProps = (dispatch) => ({
  showPasscode: (category) => dispatch(appActions.showPasscode(category)),
  showFingerprintModal: () => dispatch(appActions.showFingerprintModal()),
  callAuthVerify: () => dispatch(appActions.callAuthVerify()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
