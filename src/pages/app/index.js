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

  render() {
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
          title="page.dapp.recent"
          data={[1, 2]}
          type="row"
          getItem={() => (
            <TouchableOpacity style={[styles.item, { justifyContent: 'flex-start' }]}>
              <Image style={styles.dappIcon} source={icon} />
              <View style={styles.dappInfo}>
                <Text style={styles.dappName}>Bitcoin</Text>
                <Text style={styles.dappUrl}>bitcoin.org</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <DappCard
          title="page.dapp.recommended"
          data={[1, 2, 3, 4, 5, 6]}
          type="nest"
          getItem={() => (
            <TouchableOpacity style={[styles.item, { marginRight: 15 }]}>
              <Image style={styles.dappIcon} source={icon} />
              <View style={styles.dappInfo}>
                <Text style={styles.dappName}>Bitcoin</Text>
                <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.dappDesc, { width: Dimensions.get('window').width / 2 }]}>Bitcoin is an innovative payment network and a new kind of money.123123123123123123 </Text>
                <Text style={styles.dappUrl}>bitcoin.org</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <DappCard
          title="page.dapp.all"
          data={[1, 2, 3, 4, 5, 6]}
          type="list"
          getItem={() => (
            <TouchableOpacity style={[styles.item, { justifyContent: 'flex-start', marginTop: 15 }]}>
              <Image style={styles.dappIcon} source={icon} />
              <View style={styles.dappInfo}>
                <Text style={styles.dappName}>Bitcoin</Text>
                <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.dappDesc]}>Bitcoin is an innovative payment network and a new kind of money. </Text>
                <Text style={styles.dappUrl}>bitcoin.org</Text>
              </View>
            </TouchableOpacity>
          )}
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
