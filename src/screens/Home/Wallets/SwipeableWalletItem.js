import React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { SwipeRow, Icon } from 'native-base';
import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { setFavouriteWallet } from 'mellowallet/src/store/actions/wallet';

import WalletListItem from './WalletListItem';

const mapDispatchToProps = dispatch => ({
  setFavouriteWallet: wallet => dispatch(setFavouriteWallet(wallet)),
});

const styles = StyleSheet.create({
  swipeRow: {
    paddingTop: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingRight: 0,
    paddingLeft: 0,
    marginTop: 2,
    marginRight: 5,
    marginLeft: 5,
  },
  swipeRightComponentContainer: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    shadowColor: '#FFF',
    elevation: 0,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    backgroundColor: '#17EAD9',
    paddingTop: 15,
    paddingBottom: 15,
    width: 300,
    left: -220,
  },
  swipeButton: {
    marginRight: 12,
  },
  swipeButtonIcon: {
    color: '#FFF',
  },
});


class SwipeableWalletItemComponent extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      opened: false,
      enableToSwipe: true,
    };
  }

  setFavouriteWallet = () => {
    this.props.setFavouriteWallet(this.props.wallet);
  }

  walletSwipeRightComponent = () => (
    <View style={styles.swipeRightComponentContainer}>
      <TouchableHighlight underlayColor="transparent" transparent onPress={this.setFavouriteWallet} style={styles.swipeButton}>
        <Icon active name="flash" type="Entypo" style={styles.swipeButtonIcon} />
      </TouchableHighlight>
      <TouchableHighlight underlayColor="transparent" transparent onPress={() => alert('Hi!')} style={styles.swipeButton}>
        <Icon active name="remove-red-eye" style={styles.swipeButtonIcon} />
      </TouchableHighlight>
    </View>
  );

  handleItemSwipe(opened) {
    this.setState({ opened });
  }

  handleItemTap(pressed) {
    this.setState({ enableToSwipe: !pressed });
  }

  render() {
    const { favourite, wallet, onSwipeAction } = this.props;
    return (
      <SwipeRow
        disableRightSwipe
        rightOpenValue={-85}
        disableLeftSwipe={!this.state.enableToSwipe}
        onRowOpen={() => this.handleItemSwipe(true)}
        onRowClose={() => this.handleItemSwipe(false)}
        setScrollEnabled={onSwipeAction}
        body={(
          <WalletListItem
            wallet={wallet}
            onPress={pressed => this.handleItemTap(pressed)}
            enableOnPress={!this.state.opened}
            favourite={favourite}
          />
        )}
        right={this.walletSwipeRightComponent()}
        style={styles.swipeRow}
      />
    );
  }
}

SwipeableWalletItemComponent.propTypes = {
  onSwipeAction: PropTypes.func.isRequired,
  favourite: PropTypes.bool,
  setFavouriteWallet: PropTypes.func.isRequired,
};

SwipeableWalletItemComponent.defaultProps = {
  favourite: false,
};

const SwipeableWalletItem = connect(null, mapDispatchToProps)(SwipeableWalletItemComponent);

export default SwipeableWalletItem;
