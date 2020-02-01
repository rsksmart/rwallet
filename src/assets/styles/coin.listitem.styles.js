import { StyleSheet } from 'react-native';
import color from './color.ts';

const coinListItemStyles = StyleSheet.create({
  sectionTitle: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: color.component.swipableButtonList.rowFront.backgroundColor,
    alignItems: 'center',
  },
  rowRightView: {
    flex: 1,
    borderBottomColor: color.component.swipableButtonList.right.borderBottomColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTitleView: {
    flex: 1,
  },
  rowAmountView: {
    alignItems: 'flex-end',
    right: 5,
    position: 'absolute',
  },
  title: {
    color: color.component.swipableButtonList.title.color,
    fontSize: 16,
    fontFamily: 'Avenir-Heavy',
    letterSpacing: 0.4,
  },
  text: {
    color: color.component.swipableButtonList.text.color,
    fontFamily: 'Avenir-Roman',
    fontSize: 13,
    letterSpacing: 0.27,
  },
  worth: {
    color: color.component.swipableButtonList.worth.color,
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
    letterSpacing: 1,
  },
  amount: {
    color: color.component.swipableButtonList.amount.color,
    fontFamily: 'Avenir-Roman',
    fontSize: 12,
    letterSpacing: 1,
  },
  icon: {
    marginRight: 10,
    marginLeft: 5,
  },
});

export default coinListItemStyles;
