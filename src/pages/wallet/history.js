import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, FlatList, RefreshControl, ActivityIndicator, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import flex from '../../assets/styles/layout.flex';
import appActions from '../../redux/app/actions';
import Loc from '../../components/common/misc/loc';
import { DEVICE } from '../../common/info';
import screenHelper from '../../common/screenHelper';

const header = require('../../assets/images/misc/header.png');


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
    marginTop: 7,
    marginLeft: 25,
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
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: screenHelper.headerHeight,
    marginTop: screenHelper.headerMarginTop,
  },
});

function Item({
  title, icon, amount, datetime,
}) {
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
  icon: PropTypes.element.isRequired,
  amount: PropTypes.string.isRequired,
  datetime: PropTypes.string.isRequired,
};

class History extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    listData = [
      {
        type: 'Sending',
        icon: <SimpleLineIcons name="refresh" size={30} style={{ color: '#000000' }} />,
        amount: '0.005BTC',
        datetime: 'a few seconds ago',
      },
      {
        type: 'Received',
        icon: <SimpleLineIcons name="arrow-down-circle" size={30} style={{ color: '#6FC062' }} />,
        amount: '1.61BTC',
        datetime: 'Sep 6. 2019',
      },
      {
        type: 'Sent',
        icon: <SimpleLineIcons name="arrow-up-circle" size={30} style={{ color: '#6875B7' }} />,
        amount: '0.3BTC',
        datetime: 'Aug 12. 2019',
      },
    ];

    constructor(props) {
      super(props);
      this.onRefresh = this.onRefresh.bind(this);
      const { navigation } = this.props;
      const {
        coin,
      } = navigation.state.params;
      const { address, defaultName: name, metadata: { queryKey } } = coin;
      this.name = name;
      this.address = address;
      this.coin = coin;
      this.queryKey = queryKey;
    }

    componentDidMount() {
      this.onRefresh();
    }

    onRefresh() {
      const { getTransactions } = this.props;
      const [coin, network, address] = ['RBTC', 'Testnet', '0x626042b6e0435e23706376D61bE5e8Fc21d5c7DB'];
      // const [coin, network, address] = [this.coin, this.network, this.address];
      getTransactions(coin, network, address);
    }


    render() {
      const { transactions, isLoading, navigation } = this.props;
      this.listData = [];
      if (transactions) {
        transactions.forEach((transaction) => {
          const item = {
            type: 'Sent',
            icon: <SimpleLineIcons name="arrow-up-circle" size={30} style={{ color: '#6875B7' }} />,
            amount: '0.3BTC',
            datetime: moment(transaction.timestamp).format('MMM D. YYYY'),
          };
          this.listData.push(item);
        });
      }

      let listView = <ActivityIndicator size="small" color="#00ff00" />;
      if (transactions) {
        listView = (
          <FlatList
            data={this.listData}
            renderItem={({ item }) => (
              <Item
                title={item.type}
                icon={item.icon}
                amount={item.amount}
                datetime={item.datetime}
                onPress={item.onPress}
              />
            )}
            keyExtractor={() => `${Math.random()}`}
          />
        );
      }
      const symbol = this.coin.id.includes('BTC') ? 'BTC' : 'RSK';

      return (
        <View style={[flex.flex1]}>
          <ScrollView refreshControl={(
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => {
                this.onRefresh();
              }}
              title="Loading..."
            />
          )}
          >
            <ImageBackground source={header} style={[styles.headerImage]}>
              <Text style={[styles.headerTitle]}>{this.name}</Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
              </TouchableOpacity>
            </ImageBackground>
            <View style={styles.headerBoardView}>
              <View style={styles.headerBoard}>
                <Text style={styles.myAssets}>{`1.305 ${symbol}`}</Text>
                <Text style={styles.assetsValue}>13,198.6 USD</Text>
                <Text style={styles.sending}>{`0.0005 ${symbol} (50.56USD)`}</Text>
                <View style={styles.myAssetsButtonsView}>
                  <TouchableOpacity
                    style={styles.ButtonView}
                    onPress={() => {
                      console.log(navigation.state.params);
                      navigation.navigate('Transfer', navigation.state.params);
                    }}
                  >
                    <Entypo name="swap" size={20} style={styles.sendIcon} />
                    <Loc style={[styles.sendText]} text="Send" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.ButtonView, { borderRightWidth: 0 }]}
                    onPress={() => {
                      navigation.navigate('WalletReceive', navigation.state.params);
                    }}
                  >
                    <MaterialCommunityIcons name="arrow-down-bold-outline" size={20} style={styles.receiveIcon} />
                    <Loc style={[styles.sendText]} text="Receive" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={[styles.sectionContainer, { marginTop: 30 }]}>
              <Text style={{
                color: '#000000', fontSize: 13, letterSpacing: 0.25, fontWeight: 'bold', marginBottom: 10,
              }}
              >
                Recent
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              {listView}
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
  transactions: PropTypes.arrayOf(PropTypes.shape({})),
  getTransactions: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

History.defaultProps = {
  transactions: null,
  isLoading: false,
};

const mapStateToProps = (state) => ({
  transactions: state.App.get('transactions'),
  isLoading: state.App.get('isPageLoading'),
});

const mapDispatchToProps = (dispatch) => ({
  getTransactions: (symbol, type, address) => dispatch(
    appActions.getTransactions(symbol, type, address),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(History);
