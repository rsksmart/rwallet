import React, { Component } from 'react';
import {
  Modal, View, StyleSheet, Text, TouchableOpacity, Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../assets/styles/color';
import fontFamily from '../../assets/styles/font.family';
import space from '../../assets/styles/space';
import Loc from '../common/misc/loc';
import config from '../../../config';
import common from '../../common/common';

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.blackA50,
    justifyContent: 'center',
    flex: 1,
  },
  panel: {
    backgroundColor: color.white,
    borderRadius: 5,
    marginHorizontal: 25,
    maxHeight: '82%',
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  title: {
    fontSize: 17,
    color: color.black,
    fontFamily: fontFamily.AvenirHeavy,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: color.black,
    fontFamily: fontFamily.AvenirBook,
  },
  link: {
    fontSize: 14,
    color: color.app.theme,
    fontFamily: fontFamily.AvenirBook,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  notice: {
    fontSize: 16,
    color: color.black,
    marginTop: 10,
    marginBottom: 20,
  },
  subdomain: {
    fontSize: 16,
    color: color.black,
    fontFamily: fontFamily.AvenirBlack,
  },
  subdomainRow: {
    alignItems: 'center',
  },
  recommendButton: {
    justifyContent: 'center',
    marginTop: 25,
    height: 45,
    backgroundColor: color.app.theme,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
  },
  normalButton: {
    justifyContent: 'center',
    height: 45,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    borderColor: color.vividBlue,
    borderWidth: 1,
  },
  recommendButtonText: {
    color: color.concrete,
  },
  normalButtonText: {
    fontFamily: fontFamily.AvenirHeavy,
    color: color.vividBlue,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
  },
  keyColumn: {
    width: 80,
  },
  valueColumn: {
    flex: 1,
    textAlign: 'right',
    fontFamily: fontFamily.AvenirBook,
    color: color.dustyGray,
    fontSize: 14,
  },
  address: {
    fontSize: 12,
  },
  buttonsView: {
    marginTop: 30,
    alignItems: 'center',
  },
});

class InvalidRskAddressConfirmation extends Component {
  onCancelPressed = () => {
    const { onCancel } = this.props;
    onCancel();
  }

  onConfirmPressed = () => {
    const { onConfirm } = this.props;
    onConfirm();
  }

  onQuestionPressed = () => {
    Linking.openURL(config.accountBasedRskAddressUrl);
  }

  onExplorerPressed = () => {
    const { data } = this.props;
    const { type, address } = data;
    const url = common.getAddressUrl(type, address);
    Linking.openURL(url);
  }

  render() {
    const { data, title, body } = this.props;
    const {
      balance, symbol, type, address,
    } = data;

    const explorerName = common.getExplorerName(type);

    return (
      <Modal transparent onRequestClose={this.onCancelPressed}>
        <View style={styles.container}>
          <View style={styles.panel}>
            <Text style={[styles.title, space.marginTop_35]}>{title}</Text>
            <Text style={[styles.message, space.marginTop_22]}>{body}</Text>
            <TouchableOpacity style={space.marginTop_15} onPress={this.onExplorerPressed}>
              <Text style={[styles.link]}>{explorerName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={space.marginTop_5} onPress={this.onQuestionPressed}>
              <Loc style={[styles.link]} text="modal.invalidRskAddress.question" />
            </TouchableOpacity>
            <View style={[space.marginTop_10]}>
              <View style={styles.row}>
                <Loc style={styles.keyColumn} text="asset" />
                <Text style={styles.valueColumn}>{`${symbol} (${type})`}</Text>
              </View>
              <View style={styles.row}>
                <Loc style={styles.keyColumn} text="address" />
                <Text style={[styles.valueColumn, styles.address]}>{address}</Text>
              </View>
              <View style={styles.row}>
                <Loc style={styles.keyColumn} text="balance" />
                <Text style={styles.valueColumn}>{`${balance} ${symbol}`}</Text>
              </View>
            </View>
            <View style={[styles.buttonsView]}>
              <TouchableOpacity style={styles.normalButton} onPress={this.onConfirmPressed}>
                <Loc style={styles.normalButtonText} text="modal.invalidRskAddress.confirm" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.recommendButton, space.marginTop_10]} onPress={this.onCancelPressed}>
                <Loc style={[styles.normalButtonText, styles.recommendButtonText]} text="modal.invalidRskAddress.cancel" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

InvalidRskAddressConfirmation.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  data: PropTypes.shape({
    balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    address: PropTypes.string,
    symbol: PropTypes.string,
    type: PropTypes.string,
  }),
  title: PropTypes.string,
  body: PropTypes.string,
};

InvalidRskAddressConfirmation.defaultProps = {
  onConfirm: () => null,
  onCancel: () => null,
  data: null,
  title: null,
  body: null,
};

export default InvalidRskAddressConfirmation;
