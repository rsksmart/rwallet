import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import WalletTypeList from '../../components/wallet/wallet.type.list';
import BasePageGereral from '../base/base.page.general';
import Header from '../../components/headers/header';

class WalletAddIndex extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    listData = [
      {
        id: '1',
        title: 'page.wallet.add.createWallet',
        text: 'page.wallet.add.createWalletNote',
        icon: (<AntDesign name="wallet" size={25} style={{ color: '#515151' }} />),
        onPress: () => {
          this.createWalletFlow('WalletSelectCurrency');
        },
      },
      {
        id: '2',
        title: 'page.wallet.add.importWallet',
        text: 'page.wallet.add.importWalletNote',
        icon: (<AntDesign name="download" size={25} style={{ color: '#515151' }} />),
        onPress: () => {
          this.createWalletFlow('WalletRecovery');
        },
      },
    ];

    constructor(props) {
      super(props);
      this.createWalletFlow = this.createWalletFlow.bind(this);
    }

    async createWalletFlow(page) {
      const { navigation } = this.props;
      navigation.navigate(page);
    }

    render() {
      const { navigation } = this.props;
      return (
        <BasePageGereral
          isSafeView={false}
          hasBottomBtn={false}
          hasLoader={false}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.add.title" />}
        >
          <WalletTypeList style={[{ marginTop: 10, marginHorizontal: 15 }]} data={this.listData} />
        </BasePageGereral>
      );
    }
}

WalletAddIndex.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(WalletAddIndex);
