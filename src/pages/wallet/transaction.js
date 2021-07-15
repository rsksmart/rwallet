import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Linking, Image, ScrollView, RefreshControl, Clipboard,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Header from '../../components/headers/header';
import Loc from '../../components/common/misc/loc';
import common from '../../common/common';
import { strings } from '../../common/i18n';
import ResponsiveText from '../../components/common/misc/responsive.text';
import BasePageGereral from '../base/base.page.general';
import color from '../../assets/styles/color';
import references from '../../assets/references';
import appActions from '../../redux/app/actions';
import { createInfoNotification } from '../../common/notification.controller';

const sending = require('../../assets/images/icon/sending.png');

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  sectionContainer: {
    paddingHorizontal: 25,
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: color.black,
    marginBottom: 10,
  },
  state: {
    fontSize: 17,
    fontWeight: '600',
  },
  memo: {
    fontSize: 13,
    fontWeight: '300',
  },
  link: {
    color: color.app.theme,
    fontSize: 17,
    alignSelf: 'center',
  },
  linkView: {
    marginTop: 20,
    marginBottom: 40,
  },
  amount: {
    flex: 1,
    marginRight: 75,
  },
  amountText: {
    fontWeight: '400',
  },
  amountView: {
    flexDirection: 'row',
  },
  symbol: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginTop: 5,
  },
  stateIcon: {
    alignSelf: 'center',
    right: 0,
    position: 'absolute',
  },
  copyView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyText: {
    flex: 1,
    color: color.app.theme,
  },
  copyIcon: {
    marginLeft: 4,
    marginBottom: 2,
  },
});

const stateIcons = {
  Sent: <SimpleLineIcons name="arrow-up-circle" size={45} style={[{ color: color.shipCove }]} />,
  Sending: <Image source={sending} style={{ width: 37, height: 37 }} />,
  Received: <SimpleLineIcons name="arrow-down-circle" size={45} style={[{ color: color.mantis }]} />,
  Receiving: <Image source={sending} style={{ width: 37, height: 37 }} />,
  Failed: <MaterialIcons name="error-outline" size={50} style={[{ color: color.cinnabar }]} />,
};

class Transaction extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  static processViewData(transaction, latestBlockHeights) {
    const {
      chain, symbol, type, value, blockHeight, hash, memo, from, to, dateTime, statusText,
    } = transaction;
    let amountText = null;
    if (!_.isNil(value)) {
      const amount = common.convertUnitToCoinAmount(symbol, value);
      amountText = `${common.getBalanceString(amount, symbol)} ${common.getSymbolName(symbol, type)}`;
    }
    const dateTimeText = dateTime ? dateTime.format('LLL') : '';
    let confirmations = strings('page.wallet.transaction.Unconfirmed');
    if (transaction.state === 'Sent' || transaction.state === 'Received') {
      let latestBlockHeight = common.getLatestBlockHeight(latestBlockHeights, chain, type);
      latestBlockHeight = _.isNil(latestBlockHeight) ? 0 : latestBlockHeight;
      confirmations = latestBlockHeight - blockHeight;
      confirmations = confirmations < 0 ? 0 : confirmations;
      confirmations = confirmations >= 6 ? '6+' : confirmations;
    }
    return {
      transactionState: statusText,
      transactionId: hash,
      amount: amountText,
      stateIcon: stateIcons[statusText],
      dateTime: dateTimeText,
      confirmations,
      memo: memo || strings('page.wallet.transaction.noMemo'),
      title: `${statusText} Funds`,
      isRefreshing: false,
      from,
      to,
      chain,
    };
  }

  constructor(props) {
    super(props);
    const { navigation, latestBlockHeights } = this.props;
    const transaction = navigation.state.params;
    this.state = Transaction.processViewData(transaction, latestBlockHeights);
    this.onLinkPress = this.onLinkPress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { navigation, latestBlockHeights } = nextProps;
    const transaction = navigation.state.params;
    this.setState(Transaction.processViewData(transaction, latestBlockHeights));
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true });
    // simulate 1s network delay
    setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 1000);
  }

  onLinkPress() {
    const { navigation } = this.props;
    const transaction = navigation.state.params;
    const { symbol, type, hash } = transaction;
    const url = common.getTransactionUrl(symbol, type, hash);
    Linking.openURL(url);
  }

  onFromPress = () => {
    const { addNotification } = this.props;
    const { from } = this.state;
    Clipboard.setString(from);
    const notification = createInfoNotification(
      'modal.addressCopied.title',
      'modal.addressCopied.body',
    );
    addNotification(notification);
  }

  onToPress = () => {
    const { addNotification } = this.props;
    const { to } = this.state;
    Clipboard.setString(to);
    const notification = createInfoNotification(
      'modal.addressCopied.title',
      'modal.addressCopied.body',
    );
    addNotification(notification);
  }

  onTransactionIdPress = () => {
    const { addNotification } = this.props;
    const { transactionId } = this.state;
    Clipboard.setString(transactionId);
    const notification = createInfoNotification(
      'modal.txIdCopied.title',
      'modal.txIdCopied.body',
    );
    addNotification(notification);
  }

  render() {
    const { navigation } = this.props;
    const {
      transactionState, transactionId, amount, dateTime, memo, confirmations, title, stateIcon, isRefreshing, from, to, chain,
    } = this.state;

    const fromChecksum = common.toChecksumAddressIfNeeded(from, chain);
    const toChecksum = common.toChecksumAddressIfNeeded(to, chain);

    const txStateText = strings(`txState.${transactionState}`);

    const refreshControl = (
      <RefreshControl
        refreshing={isRefreshing}
        onRefresh={this.onRefresh}
      />
    );

    return (
      <BasePageGereral
        isSafeView
        hasBottomBtn={false}
        hasLoader={false}
        headerComponent={<Header title={`page.wallet.transaction.${title}`} onBackButtonPress={() => navigation.goBack()} />}
      >
        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          <View style={styles.sectionContainer}>
            <Loc style={[styles.sectionTitle, styles.state]} text={txStateText} />
            <View style={styles.amountView}>
              <ResponsiveText layoutStyle={styles.amount} fontStyle={styles.amountText} maxFontSize={40}>{amount}</ResponsiveText>
              <View style={styles.stateIcon}>{stateIcon}</View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Loc style={[styles.sectionTitle]} text="page.wallet.transaction.date" />
            <Text>{dateTime}</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Loc style={[styles.sectionTitle]} text="page.wallet.transaction.from" />
            <TouchableOpacity style={[styles.copyView]} onPress={this.onFromPress}>
              <Text style={[styles.copyText]}>{fromChecksum}</Text>
              <Image style={styles.copyIcon} source={references.images.copyIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContainer}>
            <Loc style={[styles.sectionTitle]} text="page.wallet.transaction.to" />
            <TouchableOpacity style={[styles.copyView]} onPress={this.onToPress}>
              <Text style={[styles.copyText]}>{toChecksum}</Text>
              <Image style={styles.copyIcon} source={references.images.copyIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContainer}>
            <Loc style={[styles.sectionTitle]} text="page.wallet.transaction.confirmations" />
            <Text>{confirmations}</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Loc style={[styles.sectionTitle, memo]} text="page.wallet.transaction.memo" />
            <Text>{memo}</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Loc style={[styles.sectionTitle]} text="page.wallet.transaction.transactionID" />
            <TouchableOpacity style={[styles.copyView]} onPress={this.onTransactionIdPress}>
              <Text style={[styles.copyText]}>{transactionId}</Text>
              <Image style={styles.copyIcon} source={references.images.copyIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContainer}>
            <TouchableOpacity style={styles.linkView} onPress={this.onLinkPress}>
              <Loc style={styles.link} text="page.wallet.transaction.viewOnChain" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </BasePageGereral>
    );
  }
}

Transaction.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    state: PropTypes.object.isRequired,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  latestBlockHeights: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const mapStateToProps = (state) => ({
  latestBlockHeights: state.Wallet.get('latestBlockHeights'),
  currentLocale: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
