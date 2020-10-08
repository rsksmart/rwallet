import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, Text, FlatList, StyleSheet, Image, Platform, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
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
import flex from '../../../assets/styles/layout.flex';

const QRCODE_SIZE = DEVICE.screenWidth * 0.6;

const checked = require('../../../assets/images/icon/checked.png');
const waiting = require('../../../assets/images/icon/sending.png');
const invitationLogo = require('../../../assets/images/icon/invitation.logo.png');

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
    width: QRCODE_SIZE + 10,
    height: QRCODE_SIZE + 10,
    marginTop: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color.alto,
    borderBottomWidth: 0,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    backgroundColor: color.white,
    justifyContent: 'center',
  },
  waitingNote: {
    color: color.codGray,
    fontFamily: 'Avenir-Roman',
    fontSize: 16,
    marginTop: 15,
    marginHorizontal: 25,
    letterSpacing: 0.5,
  },
  list: {
    marginHorizontal: 25,
    marginTop: 15,
    marginBottom: 30,
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
  shareLinkView: {
    marginTop: 15,
    marginHorizontal: 25,
  },
  shareLink: {
    color: color.app.theme,
    fontFamily: 'Avenir-Roman',
    fontSize: 14,
    textAlign: 'center',
  },
  invitationView: {
    marginHorizontal: 25,
    marginTop: 17,
    paddingBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.alto,
    borderBottomWidth: 0,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: color.white,
    alignItems: 'center',
  },
  invitationLogo: {
    position: 'absolute',
    width: QRCODE_SIZE * 0.3,
    height: QRCODE_SIZE * 0.3,
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
      this.state = { copayers: [] };
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

    onSharePressed = async () => {
      const uri = await captureRef(this.page, {
        format: 'jpg',
        quality: 0.8,
        result: 'tmpfile',
      });

      const url = uri;
      const title = '';
      const message = this.coin.invitationCode;
      const icon = '';
      const options = Platform.select({
        ios: {
          activityItemSources: [
            { // For sharing url with custom title.
              placeholderItem: { type: 'url', content: url },
              item: {
                default: { type: 'url', content: url },
              },
              subject: {
                default: title,
              },
              linkMetadata: { originalUrl: url, url, title },
            },
            { // For sharing text.
              placeholderItem: { type: 'text', content: message },
              item: {
                default: { type: 'text', content: message },
                message: null, // Specify no text to share via Messages app.
              },
              linkMetadata: { // For showing app icon on share preview.
                title: message,
              },
            },
            { // For using custom icon instead of default text icon at share preview when sharing with message.
              placeholderItem: {
                type: 'url',
                content: icon,
              },
              item: {
                default: {
                  type: 'text',
                  content: `${message}`,
                },
              },
              linkMetadata: {
                title: message,
                icon,
              },
            },
          ],
        },
        default: {
          title,
          subject: title,
          message: `${message}`,
        },
      });

      Share.open(options);
    }

    fetchMultisigInvitation = async () => {
      try {
        const invitation = await CancelablePromiseUtil.makeCancelable(parseHelper.fetchMultisigInvitation(this.coin.invitationCode), this);
        const { copayerMembers, generatedAddress, copayerNumber } = invitation;

        // If the address has been generated, assign it to the corresponding local token
        if (!_.isEmpty(generatedAddress)) {
          this.onAddressGenerated(generatedAddress);
        }

        const user = await parseHelper.getUser();
        const username = user.get('username');
        const me = _.find(copayerMembers, { username });
        me.isMe = true;

        if (copayerMembers.length !== copayerNumber) {
          copayerMembers.push({ isWaiting: true, name: strings('page.wallet.multisigInvitation.waiting') });
        }

        this.setState({ copayers: copayerMembers });
      } catch (error) {
        console.warn('fetchMultisigInvitation, error: ', error);
      }
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
        <Text style={styles.name}>{item.isMe ? strings('page.wallet.multisigInvitation.me') : item.name }</Text>
      </View>
    )

    render() {
      const { navigation } = this.props;
      const { copayers } = this.state;
      const qrText = `ms:${this.coin.invitationCode}`;

      return (
        <View style={flex.flex1} collapsable={false} ref={(ref) => { this.page = ref; }}>
          <BasePageGereral
            isSafeView
            headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.multisigInvitation.title" />}
          >
            <View style={styles.body}>
              <Text style={styles.title}>{strings('page.wallet.multisigInvitation.note')}</Text>
              <View style={styles.invitationView}>
                <View style={styles.qrCodeView}>
                  <QRCode value={qrText} size={QRCODE_SIZE} />
                  <Image style={styles.invitationLogo} source={invitationLogo} />
                </View>
                <TouchableOpacity style={styles.shareLinkView} onPress={this.onSharePressed}>
                  <Text style={styles.shareLink}>{strings('page.wallet.multisigInvitation.share')}</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.waitingNote}>{strings('page.wallet.multisigInvitation.waitingNote')}</Text>
                <FlatList
                  style={styles.list}
                  data={copayers}
                  renderItem={({ item }) => this.renderListItem(item)}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                  alwaysBounceVertical={false}
                />
              </View>
            </View>
          </BasePageGereral>
        </View>
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
