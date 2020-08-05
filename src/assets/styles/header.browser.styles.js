import { StyleSheet } from 'react-native';
import screenHelper from '../../common/screenHelper';
import color from './color.ts';

const headerHeight = 100 + screenHelper.topHeight;

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: headerHeight,
  },
  titleView: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    left: 14,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Avenir-Medium',
    fontSize: 15,
    letterSpacing: 0.39,
    marginLeft: 9,
    marginBottom: 2,
    flex: 1,
  },
  chevronView: {
    width: 10,
    height: 43,
  },
  chevron: {
    color: color.component.navBackIndicator.color,
    marginLeft: -14,
    fontSize: 40,
  },
  cross: {
    color: color.component.navBackIndicator.color,
    marginTop: 6,
    marginLeft: -13,
    fontSize: 28,
  },
  list: {
    color: color.component.navBackIndicator.color,
    marginTop: 6,
    marginLeft: -23,
    fontSize: 27,
  },
});

export default styles;
