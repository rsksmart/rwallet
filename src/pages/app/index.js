import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, Dimensions,
} from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header as NavHeader } from 'react-navigation';
import RSKad from '../../components/common/rsk.ad';
import BasePageGereral from '../base/base.page.general';
import Loc from '../../components/common/misc/loc';
import { strings } from '../../common/i18n';
import SearchInput from '../../components/common/input/searchInput';
import DappCard from '../../components/card/card.dapp';
import appActions from '../../redux/app/actions';
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
});

class AppIndex extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);

    this.state = {
      isDappWebViewVisible: false,
      dapp: null,
      searchUrl: null,
    };
  }

  componentDidMount() {
    const { fetchDapps } = this.props;
    fetchDapps();
  }

  onDappPress = (dapp) => {
    const { addRecentDapp } = this.props;
    addRecentDapp(dapp);
    this.setState({ dapp, isDappWebViewVisible: true });
  }

  // format recommended source data, such as [[dapp, dapp, dapp], [dapp, dapp, dapp], [dapp]]
  formatRecommendedSourceData = (recommendedList) => {
    const recommendedSourceData = [];
    let column = [];
    _.forEach(recommendedList, (dapp, index) => {
      column.push(dapp);

      // one column has 3 dapps
      if (!((index + 1) % 3)) {
        recommendedSourceData.push(column);
        console.log('recommendedSourceData: ', recommendedSourceData);
        column = [];
      }
    });
    if (column && column.length) {
      recommendedSourceData.push(column);
    }
    return recommendedSourceData;
  }

  render() {
    const {
      navigation, language, recentDapps, dapps,
    } = this.props;
    const {
      isDappWebViewVisible, dapp, searchUrl,
    } = this.state;

    // show 2 recent dapps
    const recentSourceData = (recentDapps && recentDapps.length > 2) ? recentDapps.slice(0, 2) : recentDapps;
    const recommendedList = _.filter(dapps, { isRecommended: true });
    const recommendedSourceData = this.formatRecommendedSourceData(recommendedList);
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
              this.setState({ isDappWebViewVisible: true, dapp: { url: searchUrl, title: searchUrl } });
            }
          }}
        />

        <DappCard
          navigation={navigation}
          title="page.dapp.recent"
          data={recentSourceData}
          type="recent"
          getItem={(item, index) => (
            <TouchableOpacity
              key={`recent-${index}`}
              style={[styles.item, { flex: 1, justifyContent: 'flex-start', marginRight: 15 }]}
              onPress={() => this.onDappPress(item)}
            >
              <Image style={[styles.dappIcon, { width: 50, height: 50 }]} source={{ uri: item.iconUrl }} />
              <View style={styles.dappInfo}>
                <Text style={styles.dappName}>{item.name[language]}</Text>
                <Text numberOfLines={2} ellipsizeMode="tail" style={styles.dappUrl}>{item.url}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <DappCard
          navigation={navigation}
          title="page.dapp.recommended"
          data={recommendedSourceData}
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
                    <Text style={styles.dappName}>{item.name[language]}</Text>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.dappDesc, { width: Dimensions.get('window').width / 2 }]}>{item.description[language]}</Text>
                    <Text style={styles.dappUrl}>{item.url}</Text>
                  </View>
                </TouchableOpacity>,
              );
            });
            return <View>{column}</View>;
          }}
        />

        <DappCard
          style={{ marginBottom: 135 }}
          navigation={navigation}
          title="page.dapp.all"
          data={dapps}
          type="all"
          getItem={(item, index) => (
            <TouchableOpacity
              key={`all-${index}`}
              style={[styles.item, { justifyContent: 'flex-start', marginTop: 15 }]}
              onPress={() => this.onDappPress(item)}
            >
              <Image style={styles.dappIcon} source={{ uri: item.iconUrl }} />
              <View style={styles.dappInfo}>
                <View style={{
                  justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center',
                }}
                >
                  <Text style={styles.dappName}>{item.name[language]}</Text>
                  <Text style={styles.dappUrl}>{item.url}</Text>
                </View>
                <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.dappDesc]}>{item.description[language]}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <WebViewModal
          title={dapp && (dapp.title[language] || dapp.title)}
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
  fetchDapps: PropTypes.func.isRequired,
  addRecentDapp: PropTypes.func.isRequired,
  recentDapps: PropTypes.arrayOf(PropTypes.object),
  dapps: PropTypes.arrayOf(PropTypes.object),
  language: PropTypes.string.isRequired,
};

AppIndex.defaultProps = {
  recentDapps: null,
  dapps: null,
};

const mapStateToProps = (state) => ({
  dapps: state.App.get('dapps'),
  recentDapps: state.App.get('recentDapps'),
  language: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  fetchDapps: () => dispatch(appActions.fetchDapps()),
  addRecentDapp: (dapp) => dispatch(appActions.addRecentDapp(dapp)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppIndex);
