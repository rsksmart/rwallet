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
    fontSize: 20,
    letterSpacing: 0.39,
    marginLeft: 12,
    marginBottom: 2,
    flex: 1,
  },
  chevronView: {
    width: 10,
    height: 43,
  },
  chevron: {
    color: color.component.navBackIndicator.color,
    marginTop: -1.5,
    marginLeft: -14,
    fontSize: 40,
  },
  cross: {
    color: color.component.navBackIndicator.color,
    marginTop: -1.5,
    marginLeft: -20,
    fontSize: 40,
  },
  list: {
    color: color.component.navBackIndicator.color,
    marginTop: -1.5,
    marginLeft: -20,
    fontSize: 40,
  },
});

export default styles;
