import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import WalletTypeList from '../../../components/wallet/wallet.type.list';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import addIndexStyles from '../../../assets/styles/add.index.styles';
import references from '../../../assets/references';

export default class SharedWalletIndex extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      const { navigation } = this.props;
      this.listData = [
        {
          title: 'page.wallet.sharedWallet.createSharedWallet',
          text: 'page.wallet.sharedWallet.createSharedWalletNote',
          icon: (<AntDesign name="wallet" style={addIndexStyles.icon} />),
          onPress: () => navigation.navigate('CreateMultisigAddress'),
        },
        {
          title: 'page.wallet.sharedWallet.joinSharedWallet',
          text: 'page.wallet.sharedWallet.joinSharedWalletNote',
          icon: (<Image source={references.images.sharedWalletIcon} />),
          onPress: () => navigation.navigate('JoinMultisigAddress'),
        },
        {
          title: 'page.wallet.sharedWallet.importSharedWallet',
          text: 'page.wallet.sharedWallet.importSharedWalletNote',
          icon: (<AntDesign name="wallet" style={addIndexStyles.icon} />),
          onPress: () => navigation.navigate('ImportMultisigAddress'),
        },
      ];
    }

    render() {
      const { navigation } = this.props;
      const header = (
        <Header
          onBackButtonPress={() => navigation.goBack()}
          title="page.wallet.sharedWallet.title"
          subTitle="page.wallet.add.subTitle"
        />
      );
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn={false}
          hasLoader={false}
          headerComponent={header}
        >
          <WalletTypeList style={addIndexStyles.walletTypeList} data={this.listData} />
        </BasePageGereral>
      );
    }
}

SharedWalletIndex.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
