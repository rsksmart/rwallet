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
import Checkbox from '../common/misc/checkbox';
import { strings } from '../../common/i18n';
import modalStyles from '../../assets/styles/modal.styles';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
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
});

class InvalidRskAddressConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRiskConfirmed: false,
    };
  }

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

  onRiskValueChanged = (value) => {
    this.setState({ isRiskConfirmed: value });
  }

  render() {
    const { data, title, body } = this.props;
    const {
      balance, symbol, type, address,
    } = data;
    const { isRiskConfirmed } = this.state;

    const explorerName = common.getExplorerName(type);

    return (
      <Modal transparent onRequestClose={this.onCancelPressed}>
        <View style={modalStyles.container}>
          <View style={modalStyles.panel}>
            <Text style={[modalStyles.title, space.marginTop_23]}>{title}</Text>
            <Text style={[modalStyles.message, space.marginTop_15]}>{body}</Text>
            <TouchableOpacity style={space.marginTop_15} onPress={this.onExplorerPressed}>
              <Text style={[modalStyles.link]}>{explorerName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={space.marginTop_5} onPress={this.onQuestionPressed}>
              <Loc style={[modalStyles.link]} text="modal.invalidRskAddress.question" />
            </TouchableOpacity>
            <View style={[space.marginTop_10]}>
              <View style={styles.row}>
                <Loc style={styles.keyColumn} text="modal.invalidRskAddress.asset" />
                <Text style={styles.valueColumn}>{`${symbol} (${type})`}</Text>
              </View>
              <View style={styles.row}>
                <Loc style={styles.keyColumn} text="modal.invalidRskAddress.address" />
                <Text style={[styles.valueColumn, styles.address]}>{address}</Text>
              </View>
              <View style={styles.row}>
                <Loc style={styles.keyColumn} text="modal.invalidRskAddress.balance" />
                <Text style={styles.valueColumn}>{`${balance} ${symbol}`}</Text>
              </View>
              <View style={[styles.row, space.marginTop_16]}>
                <Checkbox text={strings('modal.invalidRskAddress.risk')} isChecked={isRiskConfirmed} onValueChanged={this.onRiskValueChanged} />
              </View>
            </View>
            <View style={[modalStyles.buttonsView]}>
              <TouchableOpacity style={[modalStyles.normalButton, isRiskConfirmed ? null : modalStyles.disabledButton]} disabled={!isRiskConfirmed} onPress={this.onConfirmPressed}>
                <Loc style={[modalStyles.normalButtonText, isRiskConfirmed ? null : modalStyles.disabledButtonText]} text="modal.invalidRskAddress.confirm" />
              </TouchableOpacity>
              <TouchableOpacity style={[modalStyles.recommendButton, space.marginTop_10]} onPress={this.onCancelPressed}>
                <Loc style={[modalStyles.normalButtonText, modalStyles.recommendButtonText]} text="modal.invalidRskAddress.cancel" />
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
