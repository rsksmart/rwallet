import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import WalletTypeList from '../../../components/wallet/wallet.type.list';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import color from '../../../assets/styles/color';

const sharedWalletIcon = require('../../../assets/images/icon/shared.wallet.png');

const styles = StyleSheet.create({
  walletTypeList: {
    marginTop: 10,
    marginHorizontal: 15,
  },
});


class SharedWalletIndex extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    listData = [
      {
        title: 'page.wallet.sharedWallet.createSharedWallet',
        text: 'page.wallet.sharedWallet.createSharedWalletNote',
        icon: (<AntDesign name="wallet" size={25} style={{ color: color.emperor }} />),
        onPress: () => {
          this.createWalletFlow('CreateMultisigAddress');
        },
      },
      {
        title: 'page.wallet.sharedWallet.joinSharedWallet',
        text: 'page.wallet.sharedWallet.joinSharedWalletNote',
        icon: (<Image source={sharedWalletIcon} />),
        onPress: () => {
          this.createWalletFlow('JoinMultisigAddress');
        },
      },
    ];

    createWalletFlow = async (page) => {
      const { navigation } = this.props;
      navigation.navigate(page);
    }

    render() {
      const { navigation, isShowBackButton } = this.props;
      const header = (
        <Header
          isShowBackButton={isShowBackButton}
          onBackButtonPress={() => navigation.goBack()}
          title="page.wallet.sharedWallet.title"
          subTitle="page.wallet.add.subTitle"
        />
      );
      return (
        <BasePageGereral
          isSafeView={false}
          hasBottomBtn={false}
          hasLoader={false}
          headerComponent={header}
        >
          <WalletTypeList style={styles.walletTypeList} data={this.listData} />
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
  isShowBackButton: PropTypes.bool,
};

SharedWalletIndex.defaultProps = {
  isShowBackButton: true,
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(SharedWalletIndex);
