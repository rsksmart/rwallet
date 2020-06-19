import React, { Component } from 'react';
import {
  Modal, View, StyleSheet, Text, FlatList, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../assets/styles/color.ts';
import space from '../../assets/styles/space';
import Loc from '../common/misc/loc';
import common from '../../common/common';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    flex: 1,
  },
  panel: {
    backgroundColor: color.white,
    borderRadius: 5,
    marginHorizontal: 25,
    height: '82%',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 17,
    color: color.black,
    fontFamily: 'Avenir-Heavy',
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
    fontFamily: 'Avenir-Black',
  },
  address: {
    fontSize: 16,
    color: color.black,
    fontFamily: 'Avenir-Book',
    marginTop: 10,
  },
  subdomainRow: {
    alignItems: 'center',
  },
  confirmButton: {
    justifyContent: 'center',
    marginTop: 25,
    height: 50,
    backgroundColor: color.app.theme,
    borderRadius: 20,
    alignItems: 'center',
  },
  confirmText: {
    fontFamily: 'Avenir-Heavy',
    color: '#F3F3F3',
    fontSize: 16,
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  cancelText: {
    color: '#B1B1B1',
    fontFamily: 'Avenir-Roman',
  },
});

class CreateRnsConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  show = () => {
    this.setState({ visible: true });
  }

  onCancelPressed = () => {
    this.setState({ visible: false });
  }

  onConfirmPressed = () => {
    const { onConfirm } = this.props;
    onConfirm();
    this.setState({ visible: false });
  }

  renderSubdomainRow = ({ item }) => {
    const subdomain = `${item.subdomain}.wallet.rsk`;
    return (
      <View style={[styles.subdomainRow, space.marginBottom_15]}>
        <Text style={[styles.subdomain]}>{subdomain}</Text>
        <Text style={styles.address}>{common.getShortAddress(item.address)}</Text>
      </View>
    );
  }

  render() {
    const { visible } = this.state;
    const { data } = this.props;
    return (
      <Modal visible={visible} transparent>
        <View style={styles.container}>
          <View style={styles.panel}>
            <Loc style={[styles.title, space.marginTop_50]} text="button.confirm" />
            <Loc style={styles.notice} text="page.wallet.rnsCreateName.confirmNotice" interpolates={{ count: data.length }} />
            <FlatList
              extraData={data}
              data={data}
              renderItem={this.renderSubdomainRow}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={{ width: '80%' }}>
              <TouchableOpacity style={styles.confirmButton} onPress={this.onConfirmPressed}>
                <Loc style={styles.confirmText} text="button.confirm" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={this.onCancelPressed}>
                <Loc style={styles.cancelText} text="button.cancel" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

CreateRnsConfirmation.propTypes = {
  onConfirm: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.shape({})),
};

CreateRnsConfirmation.defaultProps = {
  onConfirm: () => null,
  data: undefined,
};

export default CreateRnsConfirmation;
