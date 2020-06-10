import React, { Component } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
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
import storage, { RNS_REGISTERING_SUBDOMAINS } from '../../../common/storage';
import definitions from '../../../common/definitions';
import parse from '../../../common/parse';
import { createErrorNotification } from '../../../common/notification.controller';
import { createErrorConfirmation } from '../../../common/confirmation.controller';

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
    color: color.black,
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
  addButton: {
    borderWidth: 1,
    borderColor: '#F2F2F2',
    height: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    color: '#919191',
  },
  addButtonPlus: {
    fontSize: 17,
    color: color.app.theme,
    marginRight: 4,
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
  rnsRowBalance: {
    fontSize: 16,
    fontFamily: 'Avenir-Book',
    marginRight: 7,
  },
  rnsRowAddress: {
    fontSize: 16,
    fontFamily: 'Avenir-Book',
    marginRight: 7,
    color: '#979797',
  },
  rnsRowChevron: {
    fontSize: 30,
    color: '#CBC6C6',
    position: 'absolute',
    right: 5,
  },
  notice: {
    color: color.warningText,
    marginTop: 10,
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

const shortAddress = (address) => {
  const prefix = address.substr(0, 6);
  const suffix = address.substr(address.length - 4, address.length - 1);
  const result = `${prefix}...${suffix}`;
  return result;
};

class RnsStatus extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    const { navigation } = props;
    const { subdomains } = navigation.state.params;

    const rnsRows = _.map(subdomains, (subdomain) => ({
      subdomain: subdomain.subdomain,
      address: subdomain.address,
      status: definitions.SUBDOMAIN_STATUS.PENDING,
    }));

    this.state = { rnsRows };
  }

  async componentDidMount() {
    this.fetchRegisteringRnsSubdomains();
  }

  fetchRegisteringRnsSubdomains = async () => {
    const { addConfirmation, addNotification, navigation } = this.props;
    const { rnsRows } = this.state;
    try {
      const subdomains = await parse.fetchRegisteringRnsSubdomains(rnsRows);
      console.log('fetchRegisteringRnsSubdomains: ', subdomains);
      this.setState({ rnsRows: [...subdomains] });
    } catch (error) {
      if (error.message === 'err.subdomainnotfound') {
        const notification = createErrorNotification(
          'modal.rnsSubdomainNotFound.title',
          'modal.rnsSubdomainNotFound.body',
          navigation.goBack,
        );
        addNotification(notification);
      } else {
        const confirmation = createErrorConfirmation(
          definitions.defaultErrorNotification.title,
          definitions.defaultErrorNotification.message,
          'button.retry',
          this.fetchRegisteringRnsSubdomains,
          navigation.goBack,
        );
        addConfirmation(confirmation);
      }
    }
  }

  onDonePressed = async () => {
    const { navigation } = this.props;
    storage.remove(RNS_REGISTERING_SUBDOMAINS);
    navigation.goBack();
  }

  renderRnsRow = (item, index) => {
    console.log('renderRnsRow');
    const { address, subdomain } = item;
    const { rnsRows } = this.state;
    const addressText = shortAddress(address);
    const { status } = rnsRows[index];
    let statusView = (
      <View style={styles.noticeView}>
        <ActivityIndicator style={styles.activityIndicator} size="small" animating />
        <Text style={styles.pendingNotice}>Registration waiting to be confirmed.</Text>
      </View>
    );
    if (status === definitions.SUBDOMAIN_STATUS.SUCCESS) {
      statusView = (
        <View style={styles.noticeView}>
          <Text style={styles.successNotice}>Success! Your nickname is created.</Text>
        </View>
      );
    } else if (status === definitions.SUBDOMAIN_STATUS.FAILED) {
      statusView = (
        <View style={styles.noticeView}>
          <Text style={styles.failedNotice}>Failed! Your nickname is failed to register.</Text>
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
            <Text style={styles.address}>{addressText}</Text>
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
    const { rnsRows } = this.state;

    // If there are pending subdomains, bottom button is in pending status.
    const rnsRow = _.find(rnsRows, { status: definitions.SUBDOMAIN_STATUS.PENDING });
    const buttonText = rnsRow ? 'button.pending' : 'button.done';
    const bottomButton = (<Button text={buttonText} onPress={this.onDonePressed} disabled={!!rnsRow} />);

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
    state: PropTypes.object.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array,
  }).isRequired,
  addConfirmation: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RnsStatus);
