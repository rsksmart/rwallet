import React, { Component } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, BackHandler,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Header from '../../../components/headers/header';
import BasePageGereral from '../../base/base.page.general';
import Loc from '../../../components/common/misc/loc';
import color from '../../../assets/styles/color.ts';
import space from '../../../assets/styles/space';
import Button from '../../../components/common/button/button';
import { strings } from '../../../common/i18n';
import config from '../../../../config';
import appActions from '../../../redux/app/actions';
import storage from '../../../common/storage';
import definitions from '../../../common/definitions';
import parseHelper from '../../../common/parse';
import { createErrorNotification } from '../../../common/notification.controller';
import CancelablePromiseUtil from '../../../common/cancelable.promise.util';
import common from '../../../common/common';
import TypeTag from '../../../components/common/misc/type.tag';

const REFRESH_STATUS_DELAY_TIME = 8000;

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  body: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  title: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  domainText: {
    fontSize: 16,
    color: color.black,
    marginLeft: 10,
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'Avenir-Book',
  },
  rnsRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#D8D8D8',
    marginBottom: 20,
  },
  addressView: {
    width: '100%',
    flex: 1,
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    height: 40,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontFamily: 'Avenir-Book',
    color: color.black,
    fontSize: 16,
    flex: 1,
  },
  subdomainView: {
    flex: 1,
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    height: 38,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subdomain: {
    fontFamily: 'Avenir-Book',
    color: color.black,
    fontSize: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginBottom: 10,
  },
  successNotice: {
    color: '#00B520',
  },
  pendingNotice: {
    color: '#F5A623',
  },
  failedNotice: {
    color: color.warningText,
  },
  noticeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  activityIndicator: {
    marginRight: 10,
  },
});

class RnsStatus extends Component {
  static navigationOptions = () => ({
    header: null,
    gesturesEnabled: false,
  });

  constructor(props) {
    super(props);
    this.state = { rnsRows: [], isRefreshing: false };
  }

  async componentDidMount() {
    const { setPage } = this.props;
    const subdomains = await storage.getRnsRegisteringSubdomains();

    // Set current page to redux
    setPage('RnsStatus');

    const rnsRows = _.map(subdomains, (subdomain) => ({
      subdomain: subdomain.subdomain,
      address: subdomain.address,
      type: subdomain.type,
      status: definitions.SUBDOMAIN_STATUS.PENDING,
    }));

    this.setState({ rnsRows }, this.refreshStatus);
    BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress);
  }

  componentWillUnmount() {
    const { resetPage } = this.props;

    // set page variable in redux to null
    resetPage();

    this.clearTimer();
    CancelablePromiseUtil.cancel(this);
    BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress);
  }

  refreshStatus = () => {
    this.timer = setInterval(this.fetchRegisteringRnsSubdomains, REFRESH_STATUS_DELAY_TIME);
  }

  clearTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  fetchRegisteringRnsSubdomains = async () => {
    const { addNotification, navigation } = this.props;
    const { rnsRows } = this.state;
    try {
      const subdomains = await CancelablePromiseUtil.makeCancelable(parseHelper.fetchRegisteringRnsSubdomains(rnsRows), this);
      this.setState({ rnsRows: subdomains });
      const pendingSubdomain = _.find(subdomains, { status: definitions.SUBDOMAIN_STATUS.PENDING });
      if (!pendingSubdomain) {
        this.clearTimer();
      }
    } catch (error) {
      if (error.message === 'err.subdomainnotfound') {
        this.clearTimer();
        const notification = createErrorNotification(
          'modal.rnsSubdomainNotFound.title',
          'modal.rnsSubdomainNotFound.body',
          navigation.goBack,
        );
        addNotification(notification);
      }
    } finally {
      this.setState({ isRefreshing: false });
    }
  }

  onHardwareBackPress = async () => {
    this.onDonePressed();
    return true;
  }

  onDonePressed = async () => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    const { rnsRows } = this.state;
    // If all subdomains are finished, remove registering domains from storage.
    const rnsRow = _.find(rnsRows, { status: definitions.SUBDOMAIN_STATUS.PENDING });
    if (!rnsRow) {
      storage.clearRnsRegisteringSubdomains();
    }
    // If this page is navigated from create page.
    // when go back, it need to skip it.
    navigation.pop(params && params.isSkipCreatePage ? 2 : 1);
  }

  onRefresh = async () => {
    this.setState({ isRefreshing: true });
    this.fetchRegisteringRnsSubdomains();
  }

  renderRnsRow = (item, index) => {
    const { address, subdomain } = item;
    const { rnsRows } = this.state;
    const addressText = common.getShortAddress(address);
    const { status, type } = rnsRows[index];

    let statusView = (
      <View style={styles.noticeView}>
        <ActivityIndicator style={styles.activityIndicator} size="small" animating />
        <Text style={styles.pendingNotice}>{strings('page.wallet.rnsStatus.pending')}</Text>
      </View>
    );
    if (status === definitions.SUBDOMAIN_STATUS.SUCCESS) {
      statusView = (
        <View style={styles.noticeView}>
          <Text style={styles.successNotice}>{strings('page.wallet.rnsStatus.success')}</Text>
        </View>
      );
    } else if (status === definitions.SUBDOMAIN_STATUS.FAILED) {
      statusView = (
        <View style={styles.noticeView}>
          <Text style={styles.failedNotice}>{strings('page.wallet.rnsStatus.failed')}</Text>
        </View>
      );
    }

    return (
      <View style={styles.rnsRow}>
        <View style={styles.sectionContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{strings('page.wallet.rnsCreateName.address')}</Text>
          </View>
          <View style={styles.addressView}>
            <TypeTag type={type} />
            <Text style={[styles.address, space.marginLeft_8]}>{addressText}</Text>
          </View>
        </View>
        <View style={[styles.sectionContainer, space.marginBottom_15]}>
          <Loc style={[styles.title, space.marginBottom_10]} text="page.wallet.rnsCreateName.rnsName" />
          <View style={styles.row}>
            <View style={styles.subdomainView}>
              <Text style={styles.subdomain}>{subdomain}</Text>
            </View>
            <Text style={styles.domainText}>{`.${config.rnsDomain}`}</Text>
          </View>
          {statusView}
        </View>
      </View>
    );
  }

  render() {
    const { rnsRows, isRefreshing } = this.state;

    // If there are pending subdomains, bottom button is in pending status.
    const rnsRow = _.find(rnsRows, { status: definitions.SUBDOMAIN_STATUS.PENDING });
    const buttonText = rnsRow ? 'button.pending' : 'button.done';
    const bottomButton = (<Button text={buttonText} onPress={this.onDonePressed} disabled={!!rnsRow} />);

    const refreshControl = (
      <RefreshControl
        refreshing={isRefreshing}
        onRefresh={this.onRefresh}
      />
    );

    return (
      <BasePageGereral
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader={false}
        headerComponent={<Header onBackButtonPress={this.onDonePressed} title="page.wallet.rnsCreateName.title" />}
        customBottomButton={bottomButton}
      >
        <View style={styles.body}>
          <FlatList
            refreshControl={refreshControl}
            extraData={rnsRows}
            data={rnsRows}
            renderItem={({ item, index }) => (this.renderRnsRow(item, index))}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </BasePageGereral>
    );
  }
}

RnsStatus.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    pop: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  resetPage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  setPage: (page) => dispatch(appActions.setPage(page)),
  resetPage: () => dispatch(appActions.resetPage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RnsStatus);
