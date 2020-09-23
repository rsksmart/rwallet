import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, Text, FlatList, StyleSheet, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import { StackActions } from 'react-navigation';
import appActions from '../../../redux/app/actions';
import walletActions from '../../../redux/wallet/actions';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import parseHelper from '../../../common/parse';
import CancelablePromiseUtil from '../../../common/cancelable.promise.util';
import { DEVICE } from '../../../common/info';
import { strings } from '../../../common/i18n';
import color from '../../../assets/styles/color';

const QRCODE_SIZE = DEVICE.screenHeight * 0.22;

const checked = require('../../../assets/images/icon/checked.png');
const waiting = require('../../../assets/images/icon/sending.png');

const styles = StyleSheet.create({
  body: {
    marginTop: 25,
  },
  title: {
    color: color.mineShaft,
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    marginHorizontal: 25,
  },
  qrCodeView: {
    marginTop: 30,
    alignItems: 'center',
  },
  waitingNote: {
    color: color.codGray,
    fontFamily: 'Avenir-Roman',
    fontSize: 16,
    marginTop: 30,
    marginHorizontal: 25,
    letterSpacing: 0.5,
  },
  list: {
    marginHorizontal: 25,
    marginTop: 15,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: color.tundora,
    fontFamily: 'Avenir-Book',
    fontSize: 15,
    marginHorizontal: 25,
    marginLeft: 10,
    letterSpacing: 0.38,
  },
  waitingIcon: {
    width: 20,
    height: 20,
  },
});

class MultisigAddressInvitation extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      const { coin } = props.navigation.state.params;
      this.coin = coin;
      this.state = {
        copayers: [],
        generatedAddress: undefined,
      };
    }

    async componentWillMount() {
      this.refreshMultisigInvitation();
    }

    componentWillUnmount() {
      CancelablePromiseUtil.cancel(this);
      if (this.interval) {
        clearInterval(this.interval);
      }
    }

    fetchMultisigInvitation = async () => {
      const result = await CancelablePromiseUtil.makeCancelable(parseHelper.fetchMultisigInvitation(this.coin.invitationCode), this);
      const copayerMembers = result.get('copayerMembers');
      const generatedAddress = result.get('generatedAddress');
      const copayerNumber = result.get('copayerNumber');

      // If the address has been generated, assign it to the corresponding local token
      if (!_.isEmpty(generatedAddress)) {
        this.onAddressGenerated(generatedAddress);
      }

      const user = await parseHelper.getUser();
      const username = user.get('username');
      const me = _.find(copayerMembers, { userId: username });
      me.isMe = true;

      if (copayerMembers.length !== copayerNumber) {
        copayerMembers.push({ isWaiting: true, name: 'Waiting' });
      }

      this.setState({
        copayers: copayerMembers,
        generatedAddress,
      });
    }

    refreshMultisigInvitation = () => {
      this.fetchMultisigInvitation();
      this.interval = setInterval(this.fetchMultisigInvitation, 5000);
    }

    onAddressGenerated = (address) => {
      const { setMultisigBTCAddress, navigation } = this.props;
      setMultisigBTCAddress(this.coin, address);
      const stackActions = StackActions.popToTop();
      navigation.dispatch(stackActions);
      navigation.navigate('Home');
    }

    renderListItem = (item) => (
      <View style={styles.listItem}>
        <Image style={styles.waitingIcon} source={item.isWaiting ? waiting : checked} />
        <Text style={styles.name}>{item.isMe ? 'Me' : item.name }</Text>
      </View>
    )

    render() {
      const { navigation } = this.props;
      const {
        copayers, generatedAddress,
      } = this.state;
      const qrText = `ms:${this.coin.invitationCode}`;

      return (
        <BasePageGereral
          isSafeView
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.multisigInvitation.title" />}
        >
          <View style={styles.body}>
            <Text style={styles.title}>{strings('page.wallet.multisigInvitation.note')}</Text>
            <View style={styles.qrCodeView}>
              <QRCode value={qrText} size={QRCODE_SIZE} />
            </View>
            { generatedAddress ? (<Text>{`Generated Address: ${generatedAddress}`}</Text>) : (
              <View>
                <Text style={styles.waitingNote}>{strings('page.wallet.multisigInvitation.waitingNote')}</Text>
                <FlatList
                  style={styles.list}
                  data={copayers}
                  renderItem={({ item }) => this.renderListItem(item)}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                />
              </View>
            )}
          </View>
        </BasePageGereral>
      );
    }
}

MultisigAddressInvitation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array,
    findToken: PropTypes.func,
  }).isRequired,
  setMultisigBTCAddress: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  setMultisigBTCAddress: (token, address) => dispatch(walletActions.setMultisigBTCAddress(token, address)),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultisigAddressInvitation);
