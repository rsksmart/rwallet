import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
} from 'react-native';
import posed from 'react-native-pose';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { strings } from '../../common/i18n';
import screenHelper from '../../common/screenHelper';
import color from '../../assets/styles/color';

const TABCOUNT = 4; // using let since it should be dynamic based on the config of navigation. Currently it is fixed as 2

const windowWidth = Dimensions.get('window').width;
const tabWidth = windowWidth / TABCOUNT;

const SpotLight = posed.View({
  route0: { x: tabWidth * 0.25 },
  route1: { x: tabWidth * 1.25 },
  route2: { x: tabWidth * 2.25 },
  route3: { x: tabWidth * 3.25 },
});

const Scaler = posed.View({
  active: { scale: 1.2 },
  inactive: { scale: 0.9 },
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70 + screenHelper.bottomHeight,
    elevation: 2,
    backgroundColor: color.black,
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
    paddingBottom: screenHelper.bottomHeight,
  },
  tabButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  spotLight: {
    width: tabWidth * 0.5,
    height: 6,
    backgroundColor: color.royalBlue,
    borderRadius: 8,
  },
  tabButtonText: {
    color: color.white,
  },
  badgeView: {
    minWidth: 17,
    height: 17,
    position: 'absolute',
    top: 10,
    right: 22,
    backgroundColor: color.app.theme,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    color: color.white,
    fontSize: 12,
    paddingHorizontal: 4,
  },
});

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposalNumberText: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { updateTimestamp: lastUpdateTimeStamp } = this.props;
    const { updateTimestamp, walletManager } = nextProps;
    if (updateTimestamp !== lastUpdateTimeStamp) {
      const proposals = walletManager.getProposals();
      const proposalNumber = proposals.length;
      if (proposalNumber > 0) {
        const proposalNumberText = proposalNumber > 99 ? '99+' : proposalNumber;
        this.setState({ proposalNumberText });
      } else {
        this.setState({ proposalNumberText: null });
      }
    }
  }

  render() {
    const {
      renderIcon,
      getLabelText,
      activeTintColor,
      inactiveTintColor,
      onTabPress,
      onTabLongPress,
      getAccessibilityLabel,
      navigation,
    } = this.props;

    const { routes, index: activeRouteIndex } = navigation.state;
    const { proposalNumberText } = this.state;

    return (
      <View style={styles.container}>
        <View style={StyleSheet.absoluteFillObject}>
          <SpotLight style={styles.spotLight} pose={`route${activeRouteIndex}`} />
        </View>
        {routes.map((route, routeIndex) => {
          const isRouteActive = routeIndex === activeRouteIndex;
          const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;
          const opacity = isRouteActive ? 1 : 0.6;
          return (
            <TouchableOpacity
              key={getLabelText({ route }).replace(' ', '_')}
              style={styles.tabButton}
              onPress={() => {
                onTabPress({ route });
              }}
              onLongPress={() => {
                onTabLongPress({ route });
              }}
              accessibilityLabel={getAccessibilityLabel({ route })}
            >
              <Scaler style={styles.scaler} pose={isRouteActive ? 'active' : 'inactive'}>
                {renderIcon({ route, focused: isRouteActive, tintColor })}
              </Scaler>
              { routeIndex === 0 && proposalNumberText && (
                <View style={styles.badgeView}>
                  <Text style={styles.badge}>{proposalNumberText}</Text>
                </View>
              )}
              <Text style={[styles.tabButtonText, { opacity }]}>{strings(getLabelText({ route }))}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

TabBar.propTypes = {
  renderIcon: PropTypes.func.isRequired,
  getLabelText: PropTypes.func.isRequired,
  activeTintColor: PropTypes.string.isRequired,
  inactiveTintColor: PropTypes.string.isRequired,
  onTabPress: PropTypes.func.isRequired,
  onTabLongPress: PropTypes.func.isRequired,
  getAccessibilityLabel: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({
    getProposals: PropTypes.func.isRequired,
  }).isRequired,
  updateTimestamp: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  language: state.Wallet.get('language'),
  walletManager: state.Wallet.get('walletManager'),
  updateTimestamp: state.Wallet.get('updateTimestamp'),
});

export default connect(mapStateToProps)(TabBar);
