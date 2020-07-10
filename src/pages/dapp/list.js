import React, { Component } from 'react';
import {
  Text, View, FlatList, TouchableOpacity, Image, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import BasePageSimple from '../base/base.page.simple';
import Header from '../../components/headers/header';
import appActions from '../../redux/app/actions';
import WalletSelection from '../../components/common/modal/wallet.selection.modal';
import { strings } from '../../common/i18n';
import { createDappWarningConfirmation } from '../../common/confirmation.controller';
import storage from '../../common/storage';

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 20,
    marginTop: 15,
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

class DAppList extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);

    this.state = {
      walletSelectionVisible: false,
      clickedDapp: null,
    };
  }

  componentDidMount() {
    const { fetchDapps } = this.props;
    fetchDapps();
  }

  onDappPress = (dapp) => {
    const { addConfirmation, language, recentDapps } = this.props;
    const exsitDapps = _.filter(recentDapps, (recentDapp) => recentDapp.id === dapp.id);

    if (_.isEmpty(exsitDapps)) {
      const dappName = (dapp.name && (dapp.name[language] || dapp.name.en)) || dapp.name;
      const description = (dapp.description && (dapp.description[language] || dapp.description.en)) || dapp.description;

      const dappWarningConfirmation = createDappWarningConfirmation(
        strings('modal.dappWarning.title', { dappName }),
        strings('modal.dappWarning.body', { description, dappName }),
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

  render() {
    const {
      navigation, dapps, language, recentDapps,
    } = this.props;
    const { walletSelectionVisible, clickedDapp } = this.state;
    const title = navigation.state.params.title || '';
    const type = navigation.state.params.type || '';
    let dappList = [];
    if (type === 'recent') {
      dappList = recentDapps;
    } else if (type === 'recommended') {
      dappList = _.filter(dapps, (item) => item.isRecommended);
    } else {
      dappList = _.filter(dapps, (item) => item.type === type);
    }
    return (
      <BasePageSimple
        isSafeView
        headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title={title} />}
      >
        <FlatList
          data={dappList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.item, { marginRight: 15 }]}
              onPress={() => this.onDappPress(item)}
            >
              <Image style={styles.dappIcon} source={{ uri: item.iconUrl }} />
              <View style={styles.dappInfo}>
                { item.name ? <Text numberOfLines={2} ellipsizeMode="tail" style={styles.dappName}>{item.name[language] || item.name.en}</Text> : null }
                { item.description ? <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.dappDesc]}>{item.description[language] || item.description.en}</Text> : null }
                <Text style={styles.dappUrl}>{item.url}</Text>
              </View>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `list-${index}`}
        />
        <WalletSelection
          navigation={navigation}
          visible={walletSelectionVisible}
          closeFunction={() => this.setState({ walletSelectionVisible: false })}
          dapp={clickedDapp}
        />
      </BasePageSimple>
    );
  }
}

DAppList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  dapps: PropTypes.arrayOf(PropTypes.object),
  language: PropTypes.string.isRequired,
  fetchDapps: PropTypes.func.isRequired,
  recentDapps: PropTypes.arrayOf(PropTypes.object),
  addConfirmation: PropTypes.func.isRequired,
};

DAppList.defaultProps = {
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
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DAppList);
