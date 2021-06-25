import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform,
} from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Placeholder,
  PlaceholderLine,
  Fade,
  PlaceholderMedia,
} from 'rn-placeholder';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { Header as NavHeader } from 'react-navigation-stack';
import BasePageGereral from '../base/base.page.general';
import { strings } from '../../common/i18n';
import SearchInput from '../../components/common/input/searchInput';
import DappCard from '../../components/card/card.dapp';
import appActions from '../../redux/app/actions';
import WalletSelection from '../../components/common/modal/wallet.selection.modal';
import AdsCarousel from '../../components/common/carousel/ads.carousel';
import { createDappWarningConfirmation } from '../../common/confirmation.controller';
import storage from '../../common/storage';
import color from '../../assets/styles/color';
import fontFamily from '../../assets/styles/font.family';
import Image from '../../components/common/image/image';
import config from '../../../config';
import common from '../../common/common';

const RECENT_DAPPS_NUMBER = 3; // show recent 3 dapps
const DAPP_PER_COLUMN = 3; // One column has 3 dapps
const PLACEHOLDER_TYPE = 'placeholder';
const PLACEHOLDER_LIST = [
  { type: PLACEHOLDER_TYPE, id: 1 },
  { type: PLACEHOLDER_TYPE, id: 2 },
  { type: PLACEHOLDER_TYPE, id: 3 },
  { type: PLACEHOLDER_TYPE, id: 4 },
  { type: PLACEHOLDER_TYPE, id: 5 },
];

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === 'ios' ? NavHeader.HEIGHT : 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: color.vividBlue,
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: fontFamily.AvenirHeavy,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 0,
    fontSize: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstItem: {
    marginLeft: 20,
  },
  dappIconView: {
    borderRadius: 12,
    width: 62,
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentDappSize: {
    width: 50,
    height: 50,
  },
  dappIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbDappIcon: {
    width: '85%',
    height: '85%',
  },
  dappInfo: {
    flex: 1,
    marginLeft: 18,
  },
  dappName: {
    color: color.gray06,
    fontFamily: fontFamily.AvenirBook,
    fontSize: 12,
  },
  dappDesc: {
    color: color.gray53,
    fontSize: 11,
    fontFamily: fontFamily.AvenirBook,
  },
  dappUrl: {
    color: color.grayAB,
    fontSize: 11,
    fontFamily: fontFamily.AvenirBook,
  },
  ads: {
    marginTop: 20,
    alignItems: 'center',
  },
  adItem: {
    borderRadius: 10,
    height: 112.5,
  },
  adItemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  bottomView: {
    marginBottom: 135,
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
      walletSelectionVisible: false,
      clickedDapp: null,
    };
  }

  componentDidMount() {
    const { fetchDapps, fetchAdvertisements } = this.props;
    fetchDapps();
    fetchAdvertisements();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { language, fetchDapps } = this.props;

    // reload dapp page when language changed
    if (language !== nextProps.language) {
      fetchDapps();
    }
  }

  onDappPress = (dapp) => {
    const { language, addConfirmation, recentDapps } = this.props;
    const exsitDapps = _.filter(recentDapps, (recentDapp) => recentDapp.id === dapp.id);

    if (_.isEmpty(exsitDapps)) {
      const dappName = (dapp.name && (dapp.name[language] || dapp.name.en)) || dapp.name;
      const description = (dapp.description && (dapp.description[language] || dapp.description.en)) || dapp.description;
      const dappWarningConfirmation = createDappWarningConfirmation(
        strings('modal.dappWarning.title', { dappName }),
        strings('modal.dappWarning.body', { description: description ? `${description}\n\n` : '', dappName }),
        () => {
          this.setState({ walletSelectionVisible: true, clickedDapp: dapp });
          storage.setIsShowRnsFeature();
        },
        () => {
          storage.setIsShowRnsFeature();
        },
      );
      addConfirmation(dappWarningConfirmation);
    } else {
      this.setState({ walletSelectionVisible: true, clickedDapp: dapp });
    }
  }

  // format source data, such as [[dapp, dapp, dapp], [dapp, dapp, dapp], ...]
  formatSourceData = (dappList) => {
    const sourceData = [];
    let column = [];
    _.forEach(dappList, (dapp, index) => {
      column.push(dapp);

      if (!((index + 1) % DAPP_PER_COLUMN)) {
        sourceData.push(column);
        column = [];
      }
    });
    if (column && column.length) {
      sourceData.push(column);
    }
    return sourceData;
  }

  getSourceData = () => {
    const { recentDapps, dapps } = this.props;

    // show recent dapps
    const recentSourceData = (recentDapps && recentDapps.length > RECENT_DAPPS_NUMBER) ? recentDapps.slice(0, RECENT_DAPPS_NUMBER) : recentDapps;

    const mainnetDapps = _.isEmpty(dapps) ? PLACEHOLDER_LIST : _.filter(dapps, (dapp) => _.includes(dapp.networks, 'Mainnet'));
    const testnetDapps = _.isEmpty(dapps) ? PLACEHOLDER_LIST : _.filter(dapps, (dapp) => _.includes(dapp.networks, 'Testnet'));
    // format source data to [[dapp, dapp, dapp], [dapp, dapp, dapp], ...]
    const mainnetDappList = this.formatSourceData(mainnetDapps);
    const testnetDappList = this.formatSourceData(testnetDapps);

    return {
      recent: recentSourceData,
      mainnetDappList,
      testnetDappList,
    };
  }

  getAdItem = ({ item }) => {
    const { type } = item;
    return (
      <TouchableOpacity
        style={styles.adItem}
        activeOpacity={1}
        disabled={type === PLACEHOLDER_TYPE}
        onPress={() => {
          const dapp = {
            name: item.url,
            url: item.url,
            id: item.url,
            description: '',
            networks: ['Mainnet', 'Testnet'],
          };
          this.onDappPress(dapp);
        }}
      >
        <Image style={[styles.adItemImage, type === PLACEHOLDER_TYPE ? { backgroundColor: color.grayF2 } : {}]} source={{ uri: item.imgUrl }} />
      </TouchableOpacity>
    );
  }

  getDappItem = (data, itemStyles = []) => {
    const { language } = this.props;
    const { item, index } = data;
    const { type } = item;
    if (type === PLACEHOLDER_TYPE) {
      return (
        <View
          key={`${item.id}-${index}`}
          style={[styles.item, ...itemStyles, { width: 200 }]}
        >
          <Placeholder
            Animation={Fade}
            Left={PlaceholderMedia}
          >
            <PlaceholderLine />
            <PlaceholderLine />
            <PlaceholderLine width={30} />
          </Placeholder>
        </View>
      );
    }
    return (
      <TouchableOpacity
        key={`${item.id}-${index}`}
        style={[styles.item, ...itemStyles]}
        onPress={() => this.onDappPress(item)}
      >
        <View style={styles.dappIconView}>
          <Image style={[styles.dappIcon, common.needDisplayThumbIcon(item) ? styles.thumbDappIcon : {}]} source={{ uri: (item.iconUrl || config.defaultDappIcon) }} />
        </View>
        <View style={styles.dappInfo}>
          <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.dappName, { fontSize: 18 }]}>{(item.name && (item.name[language] || item.name.en)) || item.name}</Text>
          <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.dappDesc, { width: 100 }]}>{(item.description && (item.description[language] || item.description.en)) || item.description}</Text>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.dappUrl}>{common.completionUrl(item.url)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  dappCardGetItem = (items, index) => {
    const column = [];
    _.forEach(items, (item, row) => {
      column.push(this.getDappItem({ item, row }, [{ marginRight: 20, marginTop: (row !== 0) ? 15 : 0 }]));
    });
    return <View style={!index ? styles.firstItem : {}}>{column}</View>;
  }

  render() {
    const {
      navigation, language, advertisements,
    } = this.props;
    const { searchUrl, walletSelectionVisible, clickedDapp } = this.state;

    const sourceData = this.getSourceData();
    const { recent, mainnetDappList, testnetDappList } = sourceData;

    return (
      <BasePageGereral
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader={false}
      >
        <NavigationEvents
          onWillFocus={() => {
            StatusBar.setBarStyle('dark-content');
            if (Platform.OS === 'android') {
              StatusBar.setBackgroundColor(color.white);
            }
          }}
          onWillBlur={() => {
            StatusBar.setBarStyle('light-content');
            if (Platform.OS === 'android') {
              StatusBar.setBackgroundColor(color.app.theme);
            }
          }}
        />

        <View style={styles.header} />

        <SearchInput
          style={styles.searchInput}
          value={searchUrl}
          placeholder={strings('page.dapp.search')}
          placeholderTextColor={color.grayB5}
          onChangeText={(url) => { this.setState({ searchUrl: url }); }}
          onSubmit={() => {
            if (searchUrl) {
              const url = common.completionUrl(searchUrl);
              const domain = common.getDomain(url);
              this.onDappPress({
                url, name: domain, description: '', networks: ['Mainnet', 'Testnet'], id: url, iconUrl: config.defaultDappIcon,
              });
            }
          }}
        />

        <AdsCarousel
          style={styles.ads}
          data={_.isEmpty(advertisements) ? PLACEHOLDER_LIST : advertisements}
          renderItem={this.getAdItem}
        />

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
              <View style={[styles.dappIconView, styles.recentDappSize]}>
                <Image style={[styles.dappIcon, common.needDisplayThumbIcon(item) ? styles.thumbDappIcon : {}]} source={{ uri: (item.iconUrl || config.defaultDappIcon) }} />
              </View>
              <View style={[styles.dappInfo, { marginLeft: 6 }]}>
                <Text numberOfLines={2} ellipsizeMode="tail" style={styles.dappName}>{(item.name && (item.name[language] || item.name.en)) || item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <DappCard
          navigation={navigation}
          title="networkType.mainnet"
          data={mainnetDappList}
          type="Mainnet"
          getItem={(items, index) => this.dappCardGetItem(items, index)}
        />

        <DappCard
          navigation={navigation}
          title="networkType.testnet"
          data={testnetDappList}
          type="Testnet"
          getItem={(items, index) => this.dappCardGetItem(items, index)}
        />

        <View style={styles.bottomView} />

        <WalletSelection
          navigation={navigation}
          visible={walletSelectionVisible}
          closeFunction={() => this.setState({ walletSelectionVisible: false })}
          dapp={clickedDapp}
        />
      </BasePageGereral>
    );
  }
}

DAppIndex.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.shape({}).isRequired,
  }).isRequired,
  fetchDapps: PropTypes.func.isRequired,
  fetchAdvertisements: PropTypes.func.isRequired,
  recentDapps: PropTypes.arrayOf(PropTypes.object),
  dapps: PropTypes.arrayOf(PropTypes.object),
  advertisements: PropTypes.arrayOf(PropTypes.object),
  language: PropTypes.string.isRequired,
  addConfirmation: PropTypes.func.isRequired,
};

DAppIndex.defaultProps = {
  recentDapps: null,
  dapps: null,
  advertisements: null,
};

const mapStateToProps = (state) => ({
  dapps: state.App.get('dapps'),
  advertisements: state.App.get('advertisements'),
  recentDapps: state.App.get('recentDapps'),
  language: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  fetchDapps: () => dispatch(appActions.fetchDapps()),
  fetchAdvertisements: () => dispatch(appActions.fetchAdvertisements()),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DAppIndex);
