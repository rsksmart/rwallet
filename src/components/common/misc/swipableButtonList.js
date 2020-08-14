import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Dimensions, Image, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { SwipeListView } from 'react-native-swipe-list-view';
import color from '../../../assets/styles/color';
import coinListItemStyles from '../../../assets/styles/coin.listitem.styles';
import Loc from './loc';

const styles = StyleSheet.create({
  backText: {
    color: color.component.swipableButtonList.backText.color,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backLeftBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backLeftBtnLeft: {
    backgroundColor: color.component.swipableButtonList.backLeftBtnLeft.backgroundColor,
    left: 0,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: color.component.swipableButtonList.backRightBtnLeft.backgroundColor,
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: color.component.swipableButtonList.backRightBtnRight.backgroundColor,
    right: 0,
  },
  controls: {
    alignItems: 'center',
    marginBottom: 30,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  switch: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color.black,
    paddingVertical: 10,
    width: Dimensions.get('window').width / 4,
  },
  trash: {
    height: 25,
    width: 25,
  },
});

export default class SwipableButtonList extends Component {
  constructor(props) {
    super(props);
    this.onSwapButtonPress = this.onSwapButtonPress.bind(this);
  }

  onSwapButtonPress(rowData) {
    this.listView.safeCloseOpenRow();
    if (rowData.item.onSwapButtonPress) {
      rowData.item.onSwapButtonPress();
    }
  }

  render() {
    const { data } = this.props;
    return (
      <SwipeListView
        ref={(ref) => { this.listView = ref; }}
        data={data}
        renderItem={(rowData) => (
          <TouchableOpacity
            style={coinListItemStyles.row}
            activeOpacity={1.0}
            onPress={() => {
              this.listView.safeCloseOpenRow();
              if (rowData.item.onPress) {
                rowData.item.onPress();
              }
            }}
          >
            <Image style={coinListItemStyles.icon} source={rowData.item.icon} />
            <View style={coinListItemStyles.rowRightView}>
              <View style={coinListItemStyles.rowTitleView}>
                <Text style={coinListItemStyles.title}>{rowData.item.title}</Text>
                <Text style={coinListItemStyles.text}>{rowData.item.text}</Text>
              </View>
              <View style={coinListItemStyles.rowAmountView}>
                <Text style={coinListItemStyles.worth}>{rowData.item.worth}</Text>
                <Text style={coinListItemStyles.amount}>{rowData.item.amount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        renderHiddenItem={(rowData) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              style={[
                styles.backLeftBtn,
                styles.backLeftBtnLeft,
              ]}
              onPress={() => this.onSwapButtonPress(rowData)}
            >
              <Loc style={[styles.backText]} text="button.Swap" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.backRightBtn,
                styles.backRightBtnLeft,
              ]}
              onPress={() => {
                this.listView.safeCloseOpenRow();
                if (rowData.item.r1Press) {
                  rowData.item.r1Press();
                }
              }}
            >
              <Loc style={[styles.backText]} text="button.Send" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.backRightBtn,
                styles.backRightBtnRight,
              ]}
              onPress={() => {
                this.listView.safeCloseOpenRow();
                if (rowData.item.r2Press) {
                  rowData.item.r2Press();
                }
              }}
            >
              <Loc style={[styles.backText]} text="button.Receive" />
            </TouchableOpacity>
          </View>
        )}
        leftOpenValue={75}
        stopLeftSwipe={80}
        rightOpenValue={-150}
        stopRightSwipe={-155}
      />
    );
  }
}

SwipableButtonList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    item: PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  })).isRequired,
};
