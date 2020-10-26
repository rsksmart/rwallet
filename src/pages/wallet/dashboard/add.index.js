import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import WalletTypeList from '../../../components/wallet/wallet.type.list';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import addIndexStyles from '../../../assets/styles/add.index.styles';
import space from '../../../assets/styles/space';
import references from '../../../assets/references';

class WalletAddIndex extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      const { navigation } = this.props;
      this.listData = [
        {
          title: 'page.wallet.add.createWallet',
          text: 'page.wallet.add.createWalletNote',
          icon: (<AntDesign name="wallet" style={addIndexStyles.icon} />),
          onPress: () => navigation.navigate('WalletSelectCurrency'),
        },
        {
          title: 'page.wallet.add.importWallet',
          text: 'page.wallet.add.importWalletNote',
          icon: (<AntDesign name="download" style={addIndexStyles.icon} />),
          onPress: () => navigation.navigate('WalletRecovery'),
        },
        {
          title: 'page.wallet.add.sharedWallet',
          text: 'page.wallet.add.sharedWalletNote',
          icon: (<Image source={references.images.sharedWalletIcon} />),
          onPress: () => navigation.navigate('SharedWalletIndex'),
        },
        {
          title: 'page.wallet.add.addReadOnlyWallet',
          text: 'page.wallet.add.addReadOnlyWalletNote',
          icon: (<AntDesign name="wallet" style={addIndexStyles.icon} />),
          onPress: () => navigation.navigate('AddReadOnlyWallet'),
        },
      ];
    }

    render() {
      const { navigation, isShowBackButton } = this.props;
      const header = (
        <Header
          isShowBackButton={isShowBackButton}
          onBackButtonPress={() => navigation.goBack()}
          title="page.wallet.add.title"
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
          <WalletTypeList style={[addIndexStyles.walletTypeList, space.marginBottom_80]} data={this.listData} />
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
