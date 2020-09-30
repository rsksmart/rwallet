import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import { strings } from '../../../../common/i18n';
import color from '../../../../assets/styles/color';
import { WALLET_CONNECT } from '../../../../common/constants';

const { MODAL_TYPE } = WALLET_CONNECT;

const styles = StyleSheet.create({
  title: {
    color: color.black,
    fontSize: 17,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  description: {
    color: color.black,
    fontSize: 15,
    fontFamily: 'Avenir',
    marginTop: 28,
  },
  confirmBtnView: {
    width: '80%',
    height: 44,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.app.theme,
    borderRadius: 27,
    marginTop: 30,
  },
  confirmBtnFont: {
    color: color.concrete,
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
  },
  cancelBtnView: {
    alignSelf: 'center',
    marginTop: 10,
  },
  cancelBtnFont: {
    color: color.grayB1,
    fontFamily: 'Avenir-Roman',
    fontSize: 16,
  },
});

export default class BaseModal extends PureComponent {
  renderConfirmBtns = () => {
    const { confirmPress, cancelPress } = this.props;
    return (
      <>
        <TouchableOpacity
          style={styles.confirmBtnView}
          onPress={confirmPress}
        >
          <Text style={[styles.confirmBtnFont]}>{strings('page.wallet.walletconnect.confirm')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtnView} onPress={cancelPress}>
          <Text style={[styles.cancelBtnFont]}>{strings('page.wallet.walletconnect.cancel')}</Text>
        </TouchableOpacity>
      </>
    );
  }

  renderNotifyBtns = () => {
    const { cancelPress } = this.props;
    return (
      <>
        <TouchableOpacity
          style={styles.confirmBtnView}
          onPress={cancelPress}
        >
          <Text style={[styles.confirmBtnFont]}>{strings('page.wallet.walletconnect.gotIt')}</Text>
        </TouchableOpacity>
      </>
    );
  }

  renderBtns = () => {
    const { modalType } = this.props;
    if (modalType === MODAL_TYPE.CONFIRMATION) {
      return this.renderConfirmBtns();
    }
    return this.renderNotifyBtns();
  }

  render() {
    const { title, description, content } = this.props;
    return (
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>
          {description}
        </Text>

        {content}
        {this.renderBtns()}
      </View>
    );
  }
}

BaseModal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  content: PropTypes.element,
  modalType: PropTypes.string.isRequired,
  confirmPress: PropTypes.func,
  cancelPress: PropTypes.func,
};

BaseModal.defaultProps = {
  content: null,
  confirmPress: () => null,
  cancelPress: () => null,
};
