import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, Dimensions,
} from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header as NavHeader } from 'react-navigation';
import Carousel from 'react-native-snap-carousel';
import RSKad from '../../components/common/rsk.ad';
import BasePageGereral from '../base/base.page.general';
import Loc from '../../components/common/misc/loc';
import { strings } from '../../common/i18n';
import SearchInput from '../../components/common/input/searchInput';
import DappCard from '../../components/card/card.dapp';
import appActions from '../../redux/app/actions';

const dappPerColumn = 3; // One column has 3 dapps
const { width } = Dimensions.get('window');
const viewWidth = width - 30;

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
  },
  dappUrl: {
    color: '#ABABAB',
    fontSize: 12,
    fontFamily: 'Avenir-Book',
  },
  ads: {
    marginTop: 20,
    alignItems: 'center',
  },
  adItem: {
    borderRadius: 10,
  },
  adItemImage: {
    width: '100%',
    height: 60,
    resizeMode: 'stretch',
    borderRadius: 10,
  },
});

class DAppIndex extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);

    this.state = {
      searchUrl: null,
    };
  }

  componentDidMount() {
    const { fetchDapps, fetchDappTypes, fetchAdvertisements } = this.props;
    fetchDapps();
    fetchDappTypes();
    fetchAdvertisements();
  }

  componentWillReceiveProps(nextProps) {
    const { language, fetchDapps, fetchDappTypes } = this.props;

    // reload dapp page when language changed
    if (language !== nextProps.language) {
      fetchDapps();
      fetchDappTypes();
    }
  }

  onDappPress = (dapp) => {
    const { addRecentDapp, language } = this.props;
    addRecentDapp(dapp);
    this.openBrowser(dapp.url, dapp.name && dapp.name[language]);
  }

  openBrowser = (url, name = '') => {
    const { navigation } = this.props;
    navigation.navigate('DAppBrowser', { url, name });
  }

  // format recommended source data, such as [[dapp, dapp, dapp], [dapp, dapp, dapp], ...]
  formatRecommendedSourceData = (recommendedList) => {
    const recommendedSourceData = [];
    let column = [];
    _.forEach(recommendedList, (dapp, index) => {
      column.push(dapp);

      if (!((index + 1) % dappPerColumn)) {
        recommendedSourceData.push(column);
        column = [];
      }
    });
    if (column && column.length) {
      recommendedSourceData.push(column);
    }
    return recommendedSourceData;
  }

  getSourceData = () => {
    const { recentDapps, dapps } = this.props;

    // show 2 recent dapps
    const recentSourceData = (recentDapps && recentDapps.length > 3) ? recentDapps.slice(0, 3) : recentDapps;

    // filter out recommended dapps from all dapps
    const recommendedList = _.filter(dapps, { isRecommended: true });
    // format recommended data to [[dapp, dapp, dapp], [dapp, dapp, dapp], ...]
    const recommendedSourceData = this.formatRecommendedSourceData(recommendedList);

    return {
      recent: recentSourceData,
      recommended: recommendedSourceData,
    };
  }

  getAdItem = ({ item }) => (
    <TouchableOpacity
      style={styles.adItem}
      activeOpacity={1}
      onPress={() => {
      }}
    >
      <Image style={styles.adItemImage} source={{ uri: item.imgUrl }} />
    </TouchableOpacity>
  )

  render() {
    const {
      navigation, language, walletManager, dappTypes, dapps, advertisements,
    } = this.props;
    const { searchUrl } = this.state;

    const sourceData = this.getSourceData();
    const { recent, recommended } = sourceData;

    console.log('walletManager: ', walletManager);

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

        <SearchInput
          value={searchUrl}
          placeholder={strings('page.dapp.search')}
          onChangeText={(url) => { this.setState({ searchUrl: url }); }}
          onSubmit={() => {
            if (searchUrl) {
              this.openBrowser(searchUrl);
            }
          }}
        />

        <View style={styles.ads}>
          <Carousel
            loop
            layout="default"
            data={advertisements}
            renderItem={this.getAdItem}
            sliderWidth={viewWidth}
            itemWidth={viewWidth}
          />
        </View>

        <DappCard
          navigation={navigation}
          title="page.dapp.recent"
          data={recent}
          type="recent"
          scrollEnabled={false}
          getItem={(item, index) => (
            <TouchableOpacity
              key={`recent-${index}`}
              style={[styles.item, { flex: 1, justifyContent: 'flex-start', marginRight: 15 }]}
              onPress={() => this.onDappPress(item)}
            >
              <Image style={[styles.dappIcon, { width: 40, height: 40 }]} source={{ uri: item.iconUrl }} />
              <View style={styles.dappInfo}>
                <Text style={styles.dappName}>{item.name && item.name[language]}</Text>
                <Text numberOfLines={2} ellipsizeMode="tail" style={styles.dappUrl}>{item.url}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <DappCard
          navigation={navigation}
          title="page.dapp.recommended"
          data={recommended}
          type="recommended"
          getItem={(items, col) => {
            const column = [];
            _.forEach(items, (item, row) => {
              column.push(
                <TouchableOpacity
                  key={`recommended-${col}-${row}`}
                  style={[styles.item, { marginRight: 15, marginTop: row ? 15 : 0 }]}
                  onPress={() => this.onDappPress(item)}
                >
                  <Image style={styles.dappIcon} source={{ uri: item.iconUrl }} />
                  <View style={styles.dappInfo}>
                    <Text style={styles.dappName}>{item.name && item.name[language]}</Text>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.dappDesc, { width: Dimensions.get('window').width / 2 }]}>{item.description && item.description[language]}</Text>
                    <Text style={styles.dappUrl}>{item.url}</Text>
                  </View>
                </TouchableOpacity>,
              );
            });
            return <View>{column}</View>;
          }}
        />

        {
          _.map(dappTypes, (dappType) => {
            const dappList = _.filter(dapps, (dapp) => dapp.type === dappType.name);
            if (dappList.length) {
              return (
                <DappCard
                  type={dappType.name}
                  navigation={navigation}
                  title={dappType.translation && dappType.translation[language]}
                  data={dappList}
                  getItem={(item, index) => (
                    <TouchableOpacity
                      key={`${dappType.name}-${index}`}
                      style={[styles.item, { flex: 1, justifyContent: 'flex-start', marginRight: 15 }]}
                      onPress={() => this.onDappPress(item)}
                    >
                      <Image style={styles.dappIcon} source={{ uri: item.iconUrl }} />
                      <View style={styles.dappInfo}>
                        <Text style={styles.dappName}>{item.name && item.name[language]}</Text>
                        <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.dappDesc, { width: Dimensions.get('window').width / 2 }]}>{item.description && item.description[language]}</Text>
                        <Text style={styles.dappUrl}>{item.url}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              );
            }
            return null;
          })
        }

        <View style={{ marginBottom: 135 }} />
      </BasePageGereral>
    );
  }
}

DAppIndex.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  fetchDapps: PropTypes.func.isRequired,
  fetchDappTypes: PropTypes.func.isRequired,
  fetchAdvertisements: PropTypes.func.isRequired,
  addRecentDapp: PropTypes.func.isRequired,
  recentDapps: PropTypes.arrayOf(PropTypes.object),
  dapps: PropTypes.arrayOf(PropTypes.object),
  dappTypes: PropTypes.arrayOf(PropTypes.object),
  advertisements: PropTypes.arrayOf(PropTypes.object),
  language: PropTypes.string.isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array.isRequired,
  }),
};

DAppIndex.defaultProps = {
  recentDapps: null,
  dapps: null,
  dappTypes: null,
  advertisements: null,
  walletManager: null,
};

const mapStateToProps = (state) => ({
  dapps: state.App.get('dapps'),
  dappTypes: state.App.get('dappTypes'),
  advertisements: state.App.get('advertisements'),
  recentDapps: state.App.get('recentDapps'),
  language: state.App.get('language'),
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  fetchDapps: () => dispatch(appActions.fetchDapps()),
  fetchDappTypes: () => dispatch(appActions.fetchDappTypes()),
  fetchAdvertisements: () => dispatch(appActions.fetchAdvertisements()),
  addRecentDapp: (dapp) => dispatch(appActions.addRecentDapp(dapp)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DAppIndex);
