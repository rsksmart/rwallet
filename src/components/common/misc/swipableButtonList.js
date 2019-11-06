import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Dimensions, Image, TouchableOpacity,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  backText: {
    color: color.component.swipableButtonList.backText.color,
  },
  rowFront: {
    flexDirection: 'row',
    backgroundColor: color.component.swipableButtonList.rowFront.backgroundColor,
    alignItems: 'center',
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
    borderColor: 'black',
    paddingVertical: 10,
    width: Dimensions.get('window').width / 4,
  },
  trash: {
    height: 25,
    width: 25,
  },
  right: {
    flex: 1,
    borderBottomColor: color.component.swipableButtonList.right.borderBottomColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 20,
    flexDirection: 'row',
  },
  right1: {
    flex: 1,
  },
  right2: {
    alignItems: 'flex-end',
    marginRight: 5,
  },
  icon: {
    marginRight: 20,
    marginLeft: 5,
  },
  title: {
    color: color.component.swipableButtonList.title.color,
    fontSize: 16,
    fontWeight: '900',
  },
  text: {
    color: color.component.swipableButtonList.text.color,
    fontSize: 13,
  },
  worth: {
    color: color.component.swipableButtonList.worth.color,
    fontWeight: '900',
    fontSize: 16,
  },
  amount: {
    color: color.component.swipableButtonList.amount.color,
    fontSize: 12,
  },
});

export default class SwipableButtonList extends Component {
  render() {
    const { data } = this.props;
    return (
      <SwipeListView
        ref={(ref)=>{this.listView = ref;}}
        data={data}
        renderItem={(data1) => (
          <TouchableOpacity style={styles.rowFront} activeOpacity={1.0} onPress={()=>{
            this.listView.safeCloseOpenRow();
            if(data1.item.onPress){
              data1.item.onPress();
            }
          }}>
            <Image style={styles.icon} source={data1.item.icon} />
            <View style={styles.right}>
              <View style={styles.right1}>
                <Text style={styles.title}>{data1.item.title}</Text>
                <Text style={styles.text}>{data1.item.text}</Text>
              </View>
              <View style={styles.right2}>
                <Text style={styles.worth}>{data1.item.worth}</Text>
                <Text style={styles.amount}>{data1.item.amount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        renderHiddenItem={(data1, rowMap) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              style={[
                styles.backLeftBtn,
                styles.backLeftBtnLeft,
              ]}
              onPress={() => this.closeRow(rowMap, data1.item.key)}
            >
              <Text style={styles.backText}>
                          Swap
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.backRightBtn,
                styles.backRightBtnLeft,
              ]}
              onPress={() => this.closeRow(rowMap, data1.item.key)}
            >
              <Text style={styles.backText}>
                            Send
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.backRightBtn,
                styles.backRightBtnRight,
              ]}
              onPress={()=>{
                this.listView.safeCloseOpenRow();
                if(data1.item.r2Press){
                  data1.item.r2Press();
                }
              }}
            >
              <Text style={styles.backText}>
                            Receive
              </Text>
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
