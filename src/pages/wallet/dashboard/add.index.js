import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import WalletTypeList from '../../../components/wallet/wallet.type.list';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import color from '../../../assets/styles/color';

class WalletAddIndex extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    listData = [
      {
        title: 'page.wallet.add.createWallet',
        text: 'page.wallet.add.createWalletNote',
        icon: (<AntDesign name="wallet" size={25} style={{ color: color.emperor }} />),
        onPress: () => {
          this.createWalletFlow('WalletSelectCurrency');
        },
      },
      {
        title: 'page.wallet.add.importWallet',
        text: 'page.wallet.add.importWalletNote',
        icon: (<AntDesign name="download" size={25} style={{ color: color.emperor }} />),
        onPress: () => {
          this.createWalletFlow('WalletRecovery');
        },
      },
      {
        title: 'page.wallet.add.sharedWallet',
        text: 'page.wallet.add.sharedWalletNote',
        icon: (<AntDesign name="wallet" size={25} style={{ color: color.emperor }} />),
        onPress: () => {
          this.createWalletFlow('SharedWalletIndex');
        },
      },
      {
        title: 'page.wallet.add.addReadOnlyWallet',
        text: 'page.wallet.add.addReadOnlyWalletNote',
        icon: (<AntDesign name="wallet" size={25} style={{ color: color.emperor }} />),
        onPress: () => {
          this.createWalletFlow('AddReadOnlyWallet');
        },
      },
    ];

    createWalletFlow = async (page) => {
      const { navigation } = this.props;
      navigation.navigate(page);
    }

    render() {
      const { navigation, isShowBackButton } = this.props;
      return (
        <BasePageGereral
          isSafeView={false}
          hasBottomBtn={false}
          hasLoader={false}
          headerComponent={<Header isShowBackButton={isShowBackButton} onBackButtonPress={() => navigation.goBack()} title="page.wallet.add.title" />}
        >
          <WalletTypeList style={[{ marginTop: 10, marginHorizontal: 15, marginBottom: 80 }]} data={this.listData} />
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
  isShowBackButton: PropTypes.bool,
};

WalletAddIndex.defaultProps = {
  isShowBackButton: true,
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(WalletAddIndex);
