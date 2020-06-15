import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Linking, Image, ScrollView, RefreshControl,
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
import color from '../../assets/styles/color.ts';

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
    color: '#000',
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
});

const stateIcons = {
  Sent: <SimpleLineIcons name="arrow-up-circle" size={45} style={[{ color: '#6875B7' }]} />,
  Sending: <Image source={sending} style={{ width: 37, height: 37 }} />,
  Received: <SimpleLineIcons name="arrow-down-circle" size={45} style={[{ color: '#6FC062' }]} />,
  Receiving: <Image source={sending} style={{ width: 37, height: 37 }} />,
  Failed: <MaterialIcons name="error-outline" size={50} style={[{ color: '#E73934' }]} />,
};

class Transaction extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  static processViewData(transation, latestBlockHeights) {
    const { rawTransaction } = transation;
    const {
      chain, symbol, type, value, blockHeight, hash, memo,
    } = rawTransaction;
    let amountText = null;
    if (!_.isNil(rawTransaction.value)) {
      const amount = common.convertUnitToCoinAmount(symbol, value);
      amountText = `${common.getBalanceString(amount, symbol)} ${common.getSymbolName(symbol, type)}`;
    }
    const datetimeText = transation.datetime ? transation.datetime.format('MMM Do YYYY HH:mm:ss A ZZ') : '';
    let confirmations = strings('page.wallet.transaction.Unconfirmed');
    if (transation.state === 'Sent' || transation.state === 'Received') {
      let latestBlockHeight = common.getLatestBlockHeight(latestBlockHeights, chain, type);
      latestBlockHeight = _.isNil(latestBlockHeight) ? 0 : latestBlockHeight;
      confirmations = latestBlockHeight - blockHeight;
      confirmations = confirmations < 0 ? 0 : confirmations;
      confirmations = confirmations >= 6 ? '6+' : confirmations;
    }
    return {
      transactionState: transation.state,
      transactionId: hash,
      amount: amountText,
      stateIcon: stateIcons[transation.state],
      datetime: datetimeText,
      confirmations,
      memo: memo || strings('page.wallet.transaction.noMemo'),
      title: `${transation.state} Funds`,
      isRefreshing: false,
    };
  }

  constructor(props) {
    super(props);
    const { navigation, latestBlockHeights } = this.props;
    const transation = navigation.state.params;
    this.state = Transaction.processViewData(transation, latestBlockHeights);
    this.onLinkPress = this.onLinkPress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { navigation, latestBlockHeights } = nextProps;
    const transation = navigation.state.params;
    this.setState(Transaction.processViewData(transation, latestBlockHeights));
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
    const transation = navigation.state.params;
    const { rawTransaction } = transation;
    const url = common.getTransactionUrl(rawTransaction.symbol, rawTransaction.type, rawTransaction.hash);
    Linking.openURL(url);
  }

  render() {
    const { navigation } = this.props;
    const {
      transactionState, transactionId, amount, datetime, memo, confirmations, title, stateIcon, isRefreshing,
    } = this.state;

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
            <Loc style={[styles.sectionTitle, styles.state]} text={transactionState} />
            <View style={styles.amountView}>
              <ResponsiveText layoutStyle={styles.amount} fontStyle={styles.amountText} maxFontSize={40}>{amount}</ResponsiveText>
              <View style={styles.stateIcon}>{stateIcon}</View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Loc style={[styles.sectionTitle]} text="page.wallet.transaction.date" />
            <Text>{datetime}</Text>
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
            <Text selectable>{transactionId}</Text>
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
    state: PropTypes.object.isRequired,
  }).isRequired,
  latestBlockHeights: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const mapStateToProps = (state) => ({
  latestBlockHeights: state.Wallet.get('latestBlockHeights'),
  currentLocale: state.App.get('language'),
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
