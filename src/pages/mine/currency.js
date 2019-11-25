import React, { Component } from 'react';
import {
  View, StyleSheet, ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../../components/common/misc/header';
import flex from '../../assets/styles/layout.flex';
import SelectionList from '../../components/common/list/selectionList';
import appActions from '../../redux/app/actions';

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

class Currency extends Component {
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
      this.onChange = this.onChange.bind(this);
    }

    onChange(index) {
      const { changeCurrency } = this.props;
      const currencys = ['ARS', 'USD', 'RMB', 'KRW', 'JRY', 'GBP'];
      changeCurrency(currencys[index]);
    }

    render() {
      const { currency } = this.props;
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
  changeCurrency: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  currency: state.App.get('currency'),
});

const mapDispatchToProps = (dispatch) => ({
  changeCurrency: (currency) => dispatch(
    appActions.changeCurrency(currency),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Currency);
