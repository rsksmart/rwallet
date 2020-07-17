import React, { Component } from 'react';
import _ from 'lodash';
import {
  View, TouchableOpacity, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../assets/styles/color';
import Loc from '../../components/common/misc/loc';
import ResponsiveText from '../../components/common/misc/responsive.text';


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
    color: color.app.theme,
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
  radioItemTitle: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Avenir-Roman',
    marginBottom: 1,
  },
  radioItemTitleSelected: {
    fontFamily: 'Avenir-Heavy',
  },
  radioItemText: {
    marginTop: 2,
  },
  radioItemTextFont: {
    color: '#4A4A4A',
    fontWeight: '300',
    letterSpacing: 0.23,
    marginTop: 2,
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
    marginHorizontal: 7,
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
    backgroundColor: color.app.theme,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioItemRight: {
    flex: 1,
  },
});

function Item({
  name, coin, value, isSelected, onPress,
}) {
  const check = (
    <View style={styles.circle}>
      {isSelected && <View style={styles.checkedCircle} />}
    </View>
  );
  return (
    <TouchableOpacity style={styles.radioItem} onPress={onPress}>
      <View style={styles.radioItemLeft}>
        {check}
      </View>
      <View style={styles.radioItemRight}>
        <Loc style={isSelected ? [styles.radioItemTitle, styles.radioItemTitleSelected] : [styles.radioItemTitle]} text={name} />
        <ResponsiveText layoutStyle={styles.radioItemText} fontStyle={styles.radioItemTextFont} maxFontSize={12}>{coin}</ResponsiveText>
        <ResponsiveText layoutStyle={styles.radioItemText} fontStyle={styles.radioItemTextFont} maxFontSize={12}>{value}</ResponsiveText>
      </View>
    </TouchableOpacity>
  );
}

Item.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default class RadioGroup extends Component {
  static createListData(data) {
    const listData = [
      { name: 'Slow' },
      { name: 'Average' },
      { name: 'Fast' },
    ];
    for (let i = 0; i < data.length; i += 1) {
      listData[i].coin = data[i].coin;
      listData[i].value = data[i].value;
    }
    return listData;
  }

  static renderItems(listData, selectIndex, onPress) {
    const items = [];
    if (!_.isEmpty(listData)) {
      for (let i = 0; i < listData.length; i += 1) {
        const item = listData[i];
        items.push(
          <Item
            name={`page.wallet.transfer.${item.name}`}
            coin={item.coin}
            value={item.value}
            key={i.toString()}
            isSelected={selectIndex === i}
            onPress={() => onPress(i)}
          />,
        );
      }
    }
    return items;
  }

  constructor(props) {
    super(props);
    this.state = { listData: [] };
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    const { data } = this.props;
    if (!_.isEmpty(data)) {
      const listData = RadioGroup.createListData(data);
      this.setState({ listData });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    if (!_.isEmpty(data)) {
      const listData = RadioGroup.createListData(data);
      this.setState({ listData });
    }
  }

  onPress(i) {
    const { onChange } = this.props;
    onChange(i);
  }

  render() {
    const { selectIndex } = this.props;
    const { listData } = this.state;
    return (
      <View style={styles.RadioGroup}>
        {RadioGroup.renderItems(listData, selectIndex, this.onPress)}
      </View>
    );
  }
}

RadioGroup.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectIndex: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({
    coin: PropTypes.string.isRequired,
  })),
};

RadioGroup.defaultProps = {
  selectIndex: 0,
  data: [],
};
