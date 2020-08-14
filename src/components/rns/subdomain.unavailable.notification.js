import React, { Component } from 'react';
import {
  Modal, View, StyleSheet, Text, FlatList, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../assets/styles/color.ts';
import space from '../../assets/styles/space';
import notificationStyles from '../../assets/styles/notification.styles';
import Loc from '../common/misc/loc';
import common from '../../common/common';

const styles = StyleSheet.create({
  subdomain: {
    fontSize: 16,
    color: color.black,
  },
});

class SubdomainUnavailableNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  show = () => {
    this.setState({ visible: true });
  }


  onCloseButtonPress = () => {
    this.setState({ visible: false });
  }

  renderSubdomainRow = ({ item }) => {
    const subdomain = common.getFullDomain(item);
    return (
      <View style={space.marginBottom_15}>
        <Text style={[styles.subdomain]}>{subdomain}</Text>
      </View>
    );
  }

  render() {
    const { visible } = this.state;
    const { data } = this.props;
    return (
      <Modal visible={visible} transparent>
        <View style={notificationStyles.backgroundBoard}>
          <View style={notificationStyles.frontBoard}>
            <View style={[space.paddingHorizontal_20, space.paddingBottom_10]}>
              <Loc style={notificationStyles.title} text="modal.rnsNameUnavailable.title" />
              <Loc style={[notificationStyles.text, space.marginBottom_15]} text="modal.rnsNameUnavailable.body" interpolates={{ count: data.length }} />
              <FlatList
                extraData={data}
                data={data}
                renderItem={this.renderSubdomainRow}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={notificationStyles.line} />
            <TouchableOpacity onPress={this.onCloseButtonPress}>
              <Loc style={[notificationStyles.button]} text="button.gotIt" caseType="upper" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

SubdomainUnavailableNotification.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
};

SubdomainUnavailableNotification.defaultProps = {
  data: undefined,
};

export default SubdomainUnavailableNotification;
