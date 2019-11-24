import React, { Component } from 'react';
import {
  View, StyleSheet, ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import Header from '../../components/common/misc/header';
import flex from '../../assets/styles/layout.flex';
import SelectionList from '../../components/common/list/selectionList';
import appContext from '../../common/appContext';

const styles = StyleSheet.create({
  buttonView: {
    position: 'absolute',
    bottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: '#2D2D2D',
    fontSize: 16,
    fontWeight: '300',
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    height: 80,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  listView: {
    width: '80%',
    alignSelf: 'center',
  },
});

export default class Currency extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    listData = [
      {
        title: 'ARS - Argentine Peso',
      },
      {
        title: 'USD - US Dollar',
      },
      {
        title: 'RMB - Chinese Yuan',
      },
      {
        title: 'KRW - South Korea won',
      },
      {
        title: 'JPY - Japanese Yen',
      },
      {
        title: 'GBP - Pound sterling',
      },
    ];

    constructor(props) {
      super(props);
      const { currency } = appContext.data.settings;
      this.state = { currency };
    }

    onChange(index) {
      this.a = 1;
      const currencys = ['ARS', 'USD', 'RMB', 'KRW', 'JRY', 'GBP'];
      appContext.saveSettings({ currency: currencys[index] });
    }

    render() {
      const { currency } = this.state;
      const selected = {
        ARS: 0, USD: 1, RMB: 2, KRW: 3, JRY: 4, GBP: 5,
      }[currency];
      const { navigation } = this.props;
      return (
        <ScrollView style={[flex.flex1]}>
          <Header title="Language" goBack={navigation.goBack} />
          <View style={styles.listView}>
            <SelectionList data={this.listData} onChange={this.onChange} selected={selected} />
          </View>
        </ScrollView>
      );
    }
}

Currency.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
