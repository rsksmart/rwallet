import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, FlatList, RefreshControl, ActivityIndicator, ImageBackground,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import flex from '../../assets/styles/layout.flex';
import appActions from '../../redux/app/actions';
import Loc from '../../components/common/misc/loc';
import { DEVICE } from '../../common/info';
import screenHelper from '../../common/screenHelper';

const header = require('../../assets/images/misc/header.png');
const sending = require('../../assets/images/icon/sending.png');


const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 10,
  },
  sectionContainer: {
    paddingHorizontal: 30,
  },
  addAsset: {
    color: '#77869E',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  addCircle: {
    marginLeft: 10,
    marginRight: 10,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    bottom: 101,
  },
  headerView: {
    position: 'absolute',
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    bottom: 120,
    left: 54,
    color: '#FFF',
  },
  headerBoard: {
    width: '85%',
    height: 166,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: '#FFF',
  },
  headerBoardView: {
    alignItems: 'center',
    marginTop: DEVICE.isIphoneX ? 115 + 24 : 115,
  },
  chevron: {
    color: '#FFF',
  },
  myAssets: {
    fontSize: 35,
    fontWeight: '900',
    letterSpacing: 2.92,
    color: '#000000',
    marginTop: 17,
    marginLeft: 25,
  },
  assetsValue: {
    marginTop: 10,
    marginLeft: 25,
    color: '#000000',
    fontSize: 15,
    letterSpacing: 0.94,
  },
  sending: {
    marginLeft: 5,
    color: '#000000',
    fontSize: 15,
    letterSpacing: 0.94,
  },
  myAssetsButtonsView: {
    marginTop: 13,
    marginLeft: 15,
    width: '100%',
    flexDirection: 'row',
  },
  ButtonView: {
    flexDirection: 'row',
    borderRightWidth: 1,
    borderColor: '#D1D1D1',
    marginLeft: 10,
    paddingRight: 10,
  },
  sendIcon: {
    color: '#6875B7',
  },
  receiveIcon: {
    color: '#6FC062',
  },
  swapIcon: {
    color: '#656667',
  },
  sendText: {
    color: '#6875B7',
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  receiveText: {
    color: '#6FC062',
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  swapText: {
    color: '#656667',
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    paddingBottom: 13,
    paddingTop: 10,
  },
  rowRightR1: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowRightR2: {

  },
  title: {
    fontSize: 16,
    letterSpacing: 0.33,
    color: '#000000',
  },
  amount: {
    alignSelf: 'flex-end',
    color: '#000000',
    fontWeight: '900',
    letterSpacing: 1,
  },
  datetime: {
    color: '#939393',
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: screenHelper.headerHeight,
    marginTop: screenHelper.headerMarginTop,
  },
  recent: {
    color: '#000000',
    fontSize: 13,
    letterSpacing: 0.25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sendingView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25,
    marginTop: 7,
  },
  sendingIcon: {
    width: 15,
    height: 15,
  },
});

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y
    >= contentSize.height - paddingToBottom;
};

const getStateIcon = (state) => {
  let icon = null;
  if (state === 'Sent') {
    icon = <SimpleLineIcons name="arrow-up-circle" size={30} style={{ color: '#6875B7' }} />;
  } else if (state === 'Received') {
    icon = <SimpleLineIcons name="arrow-down-circle" size={30} style={{ color: '#6FC062' }} />;
  } else if (state === 'Sending') {
    icon = <Image source={sending} />;
  }
  return icon;
};

function Item({
  title, amount, datetime,
}) {
  const icon = getStateIcon(title);
  return (
    <View style={[styles.row]}>
      {icon}
      <View style={styles.rowRight}>
        <View style={[styles.rowRightR1]}>
          <Loc style={[styles.title]} text={title} />
        </View>
        <View style={[styles.rowRightR2]}>
          <Text style={styles.amount}>{amount}</Text>
          <Text style={styles.datetime}>{datetime}</Text>
        </View>
      </View>
    </View>
  );
}

Item.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  datetime: PropTypes.string.isRequired,
};

class History extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  listData = [];

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const {
      name, address, coin,
    } = navigation.state.params;
    this.name = name;
    this.address = address;
    switch (coin) {
      case 'BTCTestnet':
        this.coin = 'BTC';
        this.net = 'Testnet';
        break;
      case 'RBTCTestnet':
        this.coin = 'BTC';
        this.net = 'Testnet';
        break;
      case 'RIFTestnet':
        this.coin = 'BTC';
        this.net = 'Testnet';
        break;
      default:
        this.coin = coin;
        this.net = 'Mainnet';
    }
    this.page = 1;
    this.onRefresh = this.onRefresh.bind(this);
    this.generateListView = this.generateListView.bind(this);
    this.refreshControl = this.refreshControl.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onSendButtonClick = this.onSendButtonClick.bind(this);
    this.onReceiveButtonClick = this.onReceiveButtonClick.bind(this);
  }

  componentDidMount() {
    this.onRefresh();
  }

  componentWillReceiveProps(nextProps) {
    this.generateListView(nextProps);
  }

  onRefresh() {
    const { getTransactions } = this.props;
    getTransactions(this.coin, this.net, this.address, this.page);
  }

  onEndReached() {
    console.log('history::onEndReached');
    const { getTransactions } = this.props;
    this.page += 1;
    getTransactions(this.coin, this.net, this.address, this.page);
  }

  onSendButtonClick() {
    const { navigation } = this.props;
    navigation.navigate('Transfer', navigation.state.params);
  }

  onReceiveButtonClick() {
    const { navigation } = this.props;
    navigation.navigate('WalletReceive', navigation.state.params);
  }

  static onScroll({ nativeEvent }) {
    if (isCloseToBottom(nativeEvent)) {
      console.log('ScrollView isCloseToBottom');
    }
  }

  static onMomentumScrollEnd() {
    console.log('ScrollView onMomentumScrollEnd');
  }

  generateListView(props) {
    const { transactions } = props;
    this.listData = transactions;
    let listView = <ActivityIndicator size="small" color="#00ff00" />;
    if (transactions) {
      listView = (
        <FlatList
          data={this.listData}
          renderItem={({ item }) => (
            <Item
              title={item.state}
              icon={item.icon}
              amount={item.amount}
              datetime={item.datetime}
              onPress={item.onPress}
            />
          )}
          keyExtractor={(item) => `${item.key}`}
        />
      );
    }
    this.listView = listView;
  }

  refreshControl() {
    const { isLoading } = this.props;
    return (
      <RefreshControl
        refreshing={isLoading}
        onRefresh={this.onRefresh}
        title="Loading..."
      />
    );
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={[flex.flex1]}>
        <ScrollView
          refreshControl={this.refreshControl()}
          onScroll={History.onScroll}
          onMomentumScrollEnd={History.onMomentumScrollEnd}
          scrollEventThrottle={400}
        >
          <ImageBackground source={header} style={[styles.headerImage]}>
            <Text style={[styles.headerTitle]}>{this.name}</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={navigation.goBack}
            >
              <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
            </TouchableOpacity>
          </ImageBackground>
          <View style={styles.headerBoardView}>
            <View style={styles.headerBoard}>
              <Text style={styles.myAssets}>{`1.305 ${this.coin}`}</Text>
              <Text style={styles.assetsValue}>13,198.6 USD</Text>
              <View style={styles.sendingView}>
                <Image style={styles.sendingIcon} source={sending} />
                <Text style={styles.sending}>{`0.0005 ${this.coin} (50.56USD)`}</Text>
              </View>
              <View style={styles.myAssetsButtonsView}>
                <TouchableOpacity
                  style={styles.ButtonView}
                  onPress={this.onSendButtonClick}
                >
                  <Entypo name="swap" size={20} style={styles.sendIcon} />
                  <Loc style={[styles.sendText]} text="Send" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.ButtonView, { borderRightWidth: 0 }]}
                  onPress={this.onReceiveButtonClick}
                >
                  <MaterialCommunityIcons name="arrow-down-bold-outline" size={20} style={styles.receiveIcon} />
                  <Loc style={[styles.sendText]} text="Receive" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={[styles.sectionContainer, { marginTop: 30 }]}>
            <Text style={styles.recent}>Recent</Text>
          </View>
          <View style={styles.sectionContainer}>
            {this.listView}
          </View>
        </ScrollView>
      </View>
    );
  }
}

History.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  getTransactions: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

History.defaultProps = {
  isLoading: false,
};

const mapStateToProps = (state) => ({
  transactions: state.App.get('transactions'),
  isLoading: state.App.get('isPageLoading'),
});

const mapDispatchToProps = (dispatch) => ({
  getTransactions: (symbol, type, address, page) => dispatch(
    appActions.getTransactions(symbol, type, address, page),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(History);
