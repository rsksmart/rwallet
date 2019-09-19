import React, { Component } from 'react';
import {
  AsyncStorage,
  Alert,
  Animated,
  View,
  Easing,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import {Svg} from 'react-native-svg';
import AnimateNumber from 'react-native-animate-number';
import Slice from 'mellowallet/src/components/Portfolio/Slice';
import { PropTypes } from 'prop-types';
import { t } from 'mellowallet/src/i18n';
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';
import { connect } from 'react-redux';
import { cotizationVariationFormatter, fiatValueFormatter } from 'mellowallet/src/utils';
import material from 'mellowallet/native-base-theme/variables/material';


const styles = StyleSheet.create({
  totalNumbers: {
    zIndex: 10000,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    height: 80,
  },
  totalPercentage: {
    textAlign: 'center',
    fontSize: 18,
    color: '#7ED321',
  },
  totalPercentageInverted: {
    color: 'red',
  },
  totalAmount: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalValue: {
    textAlign: 'center',
    color: '#7D7C7F',
  },
});

const sizesAndColors = {
  0: {
    outerRadius: 76,
    innerRadiusDiff: 0,
    color: '#EB30B5',
  },
  1: {
    outerRadius: 76,
    innerRadiusDiff: 0,
    color: '#F5A623',
  },
  2: {
    outerRadius: 76,
    innerRadiusDiff: 0,
    color: '#4A90E2',
  },
  3: {
    outerRadius: 76,
    innerRadiusDiff: 0,
    color: '#52BE80',
  },
  4: {
    outerRadius: 76,
    innerRadiusDiff: 0,
    color: '#EC7063',
  },
};

const deviceWidth = Dimensions.get('window').width;

const mapStateToProps = (state) => {
  const { portfolioReducer } = state;
  return {
    showBalanceUpdated: portfolioReducer.showBalanceUpdated,
  };
};


class Chart extends Component {
  constructor(props) {
    super(props);
    const values = this.buildData(props.data);

    this.state = {
      animValue: new Animated.Value(0.1),
      values,
      showTotal: false,
    };
  }

  componentDidMount() {
    this.animate();
    this.updateShowTotal();
  }

  componentWillReceiveProps(props) {
    this.updateShowTotal();
    const values = this.buildData(props.data);
    this.setState({ values });
  }

  updateShowTotal = async () => {
    const showTotal = await AsyncStorage.getItem(AsyncStorageEnum.PORTFOLIO_BALANCE) === 'true';
    this.setState({ showTotal });
  }

  buildOhterValues = (groupOthers) => {
    const valuesSum = groupOthers.reduce((sum, x) => sum + x.number, 0);
    return { network: t('Others'), number: parseFloat(valuesSum) };
  };

  groupValues = (values) => {
    if (values.length < 6) {
      return values;
    }
    const valueOhters = this.buildOhterValues(values.slice(4));
    return [
      ...values.slice(0, 4),
      valueOhters,
    ];
  };

  buildData = (data) => {
    const valuesInArray = Object.keys(data).map(key => ({
      network: key,
      number: data[key],
    }));

    const sortedValues = valuesInArray.sort((first, second) => {
      const diff = second.number - first.number;
      return diff / Math.abs(diff);
    });

    const groupedValues = this.groupValues(sortedValues);

    return groupedValues.map((value, index) => ({
      ...value,
      ...sizesAndColors[index],
    }));
  }

  animate = () => {
    Animated.timing(
      this.state.animValue,
      {
        toValue: 2,
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
      },
    ).start();
  };

  renderSlices = (data, endAngle) => (
    data.map((item, index) => (
      <Slice
        index={index}
        endAngle={endAngle}
        color={item.color}
        data={data}
        key={item.network}
        outerRadius={item.outerRadius}
        innerRadiusDiff={item.innerRadiusDiff}
        onPress={this.onSlicePressed}
      />
    ))
  );

  renderInsideSlice = (endAngle) => {
    const insideData = {
      network: '',
      number: 1,
    };

    const { portfolioTotal } = this.props;
    const color = portfolioTotal.balance > 0 ? 'white' : material.brandPrimary;
    return (
      <Slice
        index={0}
        endAngle={endAngle}
        color={color}
        data={[insideData]}
        key={insideData.network}
        outerRadius={59}
        innerRadiusDiff={-2}
        onPress={() => null}
      />
    );
  };

  onSlicePressed = (data) => {
    Alert.alert(`${data.network}`, `USD ${fiatValueFormatter(data.number)}`);
  }

  renderTotalAmount = () => {
    const { portfolioTotal } = this.props;
    const { balance } = portfolioTotal;
    const { showTotal } = this.state;

    return showTotal && (
      <View>
        <AnimateNumber
          adjustsFontSizeToFit
          style={styles.totalAmount}
          value={balance}
          formatter={val => `USD ${fiatValueFormatter(val)}`}
          interval={1}
          steps={24}
          timing="linear"
        />
        <Text style={styles.totalValue}>
          {t('Total value')}
        </Text>
      </View>
    );
  };

  render() {
    const { values } = this.state;
    const endAngle = Animated.multiply(this.state.animValue, Math.PI);
    const { portfolioTotal } = this.props;
    const { change } = portfolioTotal;
    const totalInverted = (change < 0) && styles.totalPercentageInverted;
    return (
      <View>
        <View style={[styles.totalNumbers, {
          width: deviceWidth - 200,
          top: (deviceWidth - 200) / 2,
        }]}
        >
          <AnimateNumber
            style={[
              styles.totalPercentage,
              totalInverted,
            ]}
            value={change}
            formatter={val => `${cotizationVariationFormatter(val)} %`}
            interval={1}
            steps={24}
            timing="linear"
          />
          {this.renderTotalAmount()}
        </View>

        <Svg
          style={{
            textAlign: 'center',
            backgroundColor: 'transparent',
            alignSelf: 'center',
          }}
          width={deviceWidth - 125}
          height={deviceWidth - 125}
          viewBox="-100 -100 200 200"
        >
          {this.renderSlices(values, endAngle)}
          {this.renderInsideSlice(endAngle)}
        </Svg>
      </View>
    );
  }
}

Chart.propTypes = {
  data: PropTypes.shape({}).isRequired,
  portfolioTotal: PropTypes.shape({
    balance: PropTypes.number.isRequired,
    change: PropTypes.number.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(Chart);
