import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, StyleSheet, ScrollView, Text, Linking, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Header from '../../components/common/misc/header';
import screenHelper from '../../common/screenHelper';
import flex from '../../assets/styles/layout.flex';
import Loc from '../../components/common/misc/loc';
import common from '../../common/common';
import { strings } from '../../common/i18n';
import ResponsiveText from '../../components/common/misc/responsive.text';

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
    color: '#00B520',
    fontSize: 17,
    alignSelf: 'center',
  },
  linkView: {
    marginTop: 20,
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
  Receiving: <SimpleLineIcons name="arrow-down-circle" size={45} style={[{ color: '#6FC062' }]} />,
  Failed: <MaterialIcons name="error-outline" size={50} style={[{ color: '#E73934' }]} />,
};

class Transaction extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  static processViewData(transation, lastBlockHeights) {
    const { rawTransaction } = transation;
    let lastBlockHeight = common.getLastBlockHeight(lastBlockHeights, rawTransaction.chain, rawTransaction.type);
    lastBlockHeight = _.isNil(lastBlockHeight) ? 0 : lastBlockHeight;
    let amountText = null;
    if (!_.isNil(rawTransaction.value)) {
      const amount = common.convertUnitToCoinAmount(rawTransaction.symbol, rawTransaction.value);
      amountText = `${common.getBalanceString(rawTransaction.symbol, amount)} ${rawTransaction.symbol}`;
    }
    let datetimeText = null;
    if (!_.isNil(transation.datetime)) {
      datetimeText = moment(transation.datetime).format('DD/MM/YYYY hh:mm a');
    }
    let confirmations = lastBlockHeight - rawTransaction.blockHeight;
    confirmations = confirmations < 0 ? 0 : confirmations;
    confirmations = confirmations >= 6 ? '6+' : confirmations;
    return {
      transactionState: transation.state,
      transactionId: rawTransaction.hash,
      amount: amountText,
      stateIcon: stateIcons[transation.state],
      datetime: datetimeText,
      confirmations,
      memo: strings('No memo'),
      title: `${transation.state} Funds`,
    };
  }

  constructor(props) {
    super(props);
    const { navigation, lastBlockHeights } = this.props;
    const transation = navigation.state.params;
    this.state = Transaction.processViewData(transation, lastBlockHeights);
    this.onLinkPress = this.onLinkPress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { navigation, lastBlockHeights } = nextProps;
    const transation = navigation.state.params;
    this.setState(Transaction.processViewData(transation, lastBlockHeights));
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
      transactionState, transactionId, amount, datetime, memo, confirmations, title, stateIcon,
    } = this.state;
    return (
      <View style={[flex.flex1]}>
        <ScrollView>
          <Header title={title} goBack={() => { navigation.goBack(); }} />
          <View style={[screenHelper.styles.body, styles.body]}>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.sectionTitle, styles.state]} text={transactionState} />
              <View style={styles.amountView}>
                <ResponsiveText style={[styles.amount]} fontStyle={[styles.amountText]} maxFontSize={40}>{amount}</ResponsiveText>
                <View style={styles.stateIcon}>{stateIcon}</View>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.sectionTitle]} text="Date" />
              <Text>{datetime}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.sectionTitle]} text="Confirmations" />
              <Text>{confirmations}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.sectionTitle, memo]} text="Memo" />
              <Text>{memo}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.sectionTitle]} text="Transaction ID" />
              <Text numberOfLines={1}>{transactionId}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <TouchableOpacity style={styles.linkView} onPress={this.onLinkPress}>
                <Loc style={styles.link} text="View on blockchain" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
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
  lastBlockHeights: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const mapStateToProps = (state) => ({
  updateTimestamp: state.Wallet.get('updateTimestamp'),
  lastBlockHeights: state.Wallet.get('lastBlockHeights'),
  currentLocale: state.App.get('language'),
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
