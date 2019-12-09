import React, { Component } from 'react';
import _ from 'lodash';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../assets/styles/color.ts';
import Loc from '../../components/common/misc/loc';


const styles = StyleSheet.create({
  headerView: {
    position: 'absolute',
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    top: 48,
    left: 55,
    color: '#FFF',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 37,
  },
  chevron: {
    color: '#FFF',
  },
  headImage: {
    position: 'absolute',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    marginLeft: 10,
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  buttonView: {
    position: 'absolute',
    bottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    alignItems: 'center',
    marginTop: 30,
  },
  check: {
    margin: 25,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: '#000000',
  },
  text: {
    color: '#4A4A4A',
    fontSize: 15,
    fontWeight: '300',
    width: '80%',
    marginTop: 15,
    textAlign: 'center',
  },
  link: {
    color: '#00B520',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  title1: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.39,
    marginBottom: 15,
    marginTop: 20,
  },
  title2: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.31,
    marginBottom: 10,
    marginTop: 10,
  },
  title3: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.23,
    marginBottom: 10,
    marginTop: 10,
  },
  textInput: {
    color: '#B5B5B5',
    fontSize: 12,
    fontWeight: '300',
    paddingVertical: 0,
    marginLeft: 5,
    marginVertical: 10,
    flex: 1,
  },
  textInputView: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputIcon: {
    marginRight: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.31,
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: 'row',
    width: '33%',
  },
  radioItemLeft: {},
  radioItemText1: {
    color: '#000000',
    fontSize: 16,
    letterSpacing: 0.31,
  },
  radioItemText2: {
    color: '#4A4A4A',
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 0.23,
  },
  radioCheck: {
    fontSize: 20,
  },
  RadioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    marginTop: 5,
    marginRight: 10,
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00B520',
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

function Item({ data, onPress }) {
  const check = (
    <View style={styles.circle}>
      {data.selected && <View style={styles.checkedCircle} />}
    </View>
  );
  return (
    <TouchableOpacity style={styles.radioItem} onPress={onPress}>
      <View style={styles.radioItemLeft}>
        {check}
      </View>
      <View>
        <Loc style={[styles.radioItemText1]} text={data.name} />
        <Text style={styles.radioItemText2}>
          {data.coin}
        </Text>
        <Text style={styles.radioItemText2}>
          {data.value}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

Item.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    coin: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default class RadioGroup extends Component {
  listData = [
    {
      name: 'Slow',
      coin: '0.0046BTC',
      value: '$ 0.46',
      selected: false,
    },
    {
      name: 'Average',
      coin: '0.0048BTC',
      value: '$ 0.68',
      selected: false,
    },
    {
      name: 'Fast',
      coin: '0.0052BTC',
      value: '$ 0.84',
      selected: false,
    },
  ];

  constructor(props) {
    super(props);
    const { selected } = this.props;
    this.state = { selected };
    const { data } = this.props;
    if (!_.isEmpty(data)) {
      for (let i = 0; i < data.length; i += 1) {
        this.listData[i].coin = data[i].coin;
      }
    }
  }

  render() {
    const items = [];
    const { selected } = this.state;
    const { onChange } = this.props;

    if (!_.isEmpty(this.listData)) {
      for (let i = 0; i < this.listData.length; i += 1) {
        if (selected === i) {
          this.listData[i].selected = true;
        } else {
          this.listData[i].selected = false;
        }
        items.push(
          <Item
            data={this.listData[i]}
            key={`${Math.random()}`}
            onPress={() => {
              this.setState({ selected: i });
              onChange(i);
            }}
          />,
        );
      }
    }

    return (
      <View style={styles.RadioGroup}>
        {items}
      </View>
    );
  }
}

RadioGroup.propTypes = {
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({
    coin: PropTypes.string.isRequired,
  })),
};

RadioGroup.defaultProps = {
  selected: 0,
  data: [],
};
