import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import PropTypes from 'prop-types';
import List from './list';
import AddIndex from './add.index';

class Dashboard extends Component {
    static navigationOptions = () => ({
      header: null,
    });

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
  }).isRequired,
  wallets: PropTypes.arrayOf(PropTypes.object),
};

Dashboard.defaultProps = {
  wallets: undefined,
};

const mapStateToProps = (state) => ({
  updateTimestamp: state.Wallet.get('updateTimestamp'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
});

export default connect(mapStateToProps, null)(Dashboard);
