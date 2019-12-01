import React, { Component } from 'react';

import PropTypes from 'prop-types';
import List from './list';
import AddIndex from './add.index';
import wm from '../../common/wallet/walletManager';

export default class Dashboard extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        hasWallet: true,
      };
    }

    async componentDidMount(): void {
      await wm.loadWallets();
      const hasWallet = !!wm.wallets.length;
      this.setState({ hasWallet });
    }

    render() {
      const { hasWallet } = this.state;
      const { navigation } = this.props;
      return hasWallet ? <List navigation={navigation} /> : <AddIndex navigation={navigation} />;
    }
}

Dashboard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    pop: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
