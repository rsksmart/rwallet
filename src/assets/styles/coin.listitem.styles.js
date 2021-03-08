import { StyleSheet } from 'react-native';
import color from './color';
import fontFamily from './font.family';

const coinListItemStyles = StyleSheet.create({
  sectionTitle: {
    fontFamily: fontFamily.AvenirHeavy,
    marginBottom: 10,
    fontSize: 14,
    color: color.black,
    paddingHorizontal: 10,
  },
  itemView: {
    marginBottom: 25,
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
    paddingTop: 12,
    paddingBottom: 15,
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
    fontFamily: fontFamily.AvenirHeavy,
    letterSpacing: 0.4,
  },
  text: {
    color: color.component.swipableButtonList.text.color,
    fontFamily: fontFamily.AvenirRoman,
    fontSize: 13,
    letterSpacing: 0.27,
  },
  worth: {
    color: color.component.swipableButtonList.worth.color,
    fontFamily: fontFamily.AvenirHeavy,
    fontSize: 16,
    letterSpacing: 1,
  },
  amount: {
    color: color.component.swipableButtonList.amount.color,
    fontFamily: fontFamily.AvenirRoman,
    fontSize: 12,
    letterSpacing: 1,
  },
  icon: {
    marginRight: 10,
    marginLeft: 5,
  },
});

export default coinListItemStyles;
