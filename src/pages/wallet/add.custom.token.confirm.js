import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Header from '../../components/headers/header';
import Loc from '../../components/common/misc/loc';
import BasePageGereral from '../base/base.page.general';
// import color from '../../assets/styles/color.ts';
import space from '../../assets/styles/space';
import color from '../../assets/styles/color.ts';
import references from '../../assets/references';

const styles = StyleSheet.create({
  sectionContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#D8D8D8',
    paddingBottom: 20,
  },
  title: {
    color: color.black,
    fontFamily: 'Avenir-Roman',
    fontSize: 17,
    alignSelf: 'center',
  },
  tokenView: {
    marginTop: 10,
    marginHorizontal: 50,
  },
  row: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  rowTitle: {
    color: color.black,
    fontFamily: 'Avenir-Roman',
    fontSize: 16,
    flex: 1,
  },
  tokenLogo: {
    width: 26,
    height: 26,
  },
  symbol: {
    color: '#042C5C',
    fontFamily: 'Avenir-Heavy',
    fontSize: 20,
    letterSpacing: 0.5,
  },
  balance: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default class AddCustomToken extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.onPress = this.onPress.bind(this);
    }

    onPress() {
      console.log(this);
    }

    render() {
      const { navigation } = this.props;
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn
          hasLoader={false}
          bottomBtnText="button.Confirm"
          bottomBtnOnPress={this.onPress}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.addCustomTokenConfirm.title" />}
        >
          <View>
            <Loc style={[styles.title, space.marginTop_30]} text="page.wallet.addCustomTokenConfirm.question" />
            <View style={styles.tokenView}>
              <View style={styles.row}>
                <Loc style={styles.rowTitle} text="page.wallet.addCustomTokenConfirm.token" />
                <Image style={[styles.tokenLogo, space.marginRight_10]} source={references.images.customToken} />
                <Text style={styles.symbol}>BTC</Text>
              </View>
              <View style={styles.row}>
                <Loc style={styles.rowTitle} text="page.wallet.addCustomTokenConfirm.balance" />
                <Text style={styles.balance}>1396.723 BTC</Text>
              </View>
            </View>
          </View>
        </BasePageGereral>
      );
    }
}

AddCustomToken.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
