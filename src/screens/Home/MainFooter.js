import React, { PureComponent } from 'react';
import { Keyboard } from 'react-native';
import {
  Footer,
  FooterTab,
} from 'native-base';
import BottomTabButton from 'mellowallet/src/components/BottomTabButton';
import { t } from 'mellowallet/src/i18n';
import RemovableView from 'mellowallet/src/components/RemovableView';

const routes = [
  {
    index: 0,
    name: 'Wallets',
    icon: 'account-balance-wallet',
    label: 'Wallets',
  },
  {
    index: 1,
    name: 'Exchange',
    icon: 'swap-horiz',
    label: 'Exchange',
  },
  {
    index: 2,
    name: 'Portfolio',
    label: 'Mellow',
  },
  {
    index: 3,
    name: 'History',
    icon: 'history',
    label: 'History',
  },
  {
    index: 4,
    name: 'Settings',
    icon: 'settings',
    label: 'Settings',
  },
];

export default class MainFooter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showFooter: true,
    };
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow() {
    this.setState({ showFooter: false });
  }

  keyboardDidHide() {
    this.setState({ showFooter: true });
  }

  render() {
    const { navigation } = this.props;
    const tabButtons = routes.map(route => (
      <BottomTabButton
        active={navigation.state.index === route.index}
        key={route.index}
        label={t(route.label)}
        icon={route.icon}
        onPress={() => navigation.navigate(route.name)}
      />
    ));

    return (
      <RemovableView hidden={!this.state.showFooter}>
        <Footer>
          <FooterTab>
            {tabButtons}
          </FooterTab>
        </Footer>
      </RemovableView>
    );
  }
}
