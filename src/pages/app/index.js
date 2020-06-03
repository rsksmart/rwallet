import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { Header as NavHeader } from 'react-navigation';
import RSKad from '../../components/common/rsk.ad';
import BasePageGereral from '../base/base.page.general';
import Loc from '../../components/common/misc/loc';
import { strings } from '../../common/i18n';
import SearchInput from '../../components/common/input/searchInput';
import DappCard from '../../components/card/card.dapp';
import WebViewModal from '../../components/common/webview.modal';

const styles = StyleSheet.create({
  header: {
    marginTop: NavHeader.HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#028CFF',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Avenir-Heavy',
  },
  item: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dappIcon: {
    width: 62,
    height: 62,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  dappInfo: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  dappName: {
    color: '#060606',
    fontFamily: 'Avenir-Book',
    fontSize: 18,
  },
  dappDesc: {
    color: '#535353',
    fontSize: 11,
    fontFamily: 'Avenir-Book',
    textAlignVertical: 'center',
  },
  dappUrl: {
    color: '#ABABAB',
    fontSize: 12,
    fontFamily: 'Avenir-Book',
  },
});

const icon = require('../../assets/images/icon/dapp.btc.png');

class AppIndex extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);

    const dapp = {
      name: 'Bitcoin',
      url: 'https://testnet.manager.rns.rifos.org/',
      desc: 'Bitcoin is an innovative payment network and a new kind of money.',
    };

    this.state = {
      recentList: [dapp, dapp],
      recommendedList: [
        [dapp, dapp, dapp],
        [dapp, dapp, dapp],
        [dapp, dapp, dapp],
        [dapp],
      ],
      allList: [dapp, dapp, dapp, dapp, dapp, dapp],
      isDappWebViewVisible: false,
      dapp: {},
    };
  }

  onItemPress = (dapp) => {
    this.setState({ dapp, isDappWebViewVisible: true });
  }

  render() {
    const { navigation } = this.props;
    const {
      recentList, recommendedList, allList, isDappWebViewVisible, dapp,
    } = this.state;
    return (
      <BasePageGereral
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader={false}
        renderAccessory={() => <RSKad />}
      >
        <View style={styles.header}>
          <Loc style={[styles.headerText]} text="page.dapp.title" />
        </View>

        <SearchInput placeholder={strings('page.dapp.search')} />

        <DappCard
          navigation={navigation}
          title="page.dapp.recent"
          data={recentList}
          type="row"
          getItem={(item, index) => (
            <TouchableOpacity
              key={`row-${index}`}
              style={[styles.item, { justifyContent: 'flex-start' }]}
              onPress={() => this.onItemPress(item)}
            >
              <Image style={[styles.dappIcon, { width: 50, height: 50 }]} source={icon} />
              <View style={styles.dappInfo}>
                <Text style={styles.dappName}>{item.name}</Text>
                <Text style={styles.dappUrl}>{item.url}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <DappCard
          navigation={navigation}
          title="page.dapp.recommended"
          data={recommendedList}
          type="nest"
          getItem={(items, index) => {
            const view = items.map((item) => (
              <TouchableOpacity
                key={`nest-${index}`}
                style={[styles.item, { marginRight: 15 }]}
                onPress={() => this.onItemPress(item)}
              >
                <Image style={styles.dappIcon} source={icon} />
                <View style={styles.dappInfo}>
                  <Text style={styles.dappName}>{item.name}</Text>
                  <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.dappDesc, { width: Dimensions.get('window').width / 2 }]}>{item.desc}</Text>
                  <Text style={styles.dappUrl}>{item.url}</Text>
                </View>
              </TouchableOpacity>
            ));
            return view;
          }}
        />

        <DappCard
          style={{ marginBottom: 135 }}
          navigation={navigation}
          title="page.dapp.all"
          data={allList}
          type="list"
          getItem={(item, index) => (
            <TouchableOpacity
              key={`list-${index}`}
              style={[styles.item, { justifyContent: 'flex-start', marginTop: 15 }]}
              onPress={() => this.onItemPress(item)}
            >
              <Image style={styles.dappIcon} source={icon} />
              <View style={styles.dappInfo}>
                <View style={{
                  justifyContent: 'space-between', flex: 1, flexDirection: 'row', alignItems: 'center',
                }}
                >
                  <Text style={styles.dappName}>{item.name}</Text>
                  <Text style={styles.dappUrl}>{item.url}</Text>
                </View>
                <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.dappDesc]}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <WebViewModal
          title={dapp && dapp.name}
          url={dapp && dapp.url}
          visible={isDappWebViewVisible}
          onBackButtonPress={() => { this.setState({ isDappWebViewVisible: false }); }}
        />
      </BasePageGereral>
    );
  }
}

AppIndex.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

export default AppIndex;
