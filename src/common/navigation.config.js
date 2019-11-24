/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { Text } from 'react-native';
import React from 'react';

import common from './common';
import BackBtn from '../components/common/buttons/back.btn.stateless';

import WalletAddIndex from '../pages/wallet/add.index';
import WalletSelectCurrency from '../pages/wallet/select.currency';
import WalletCreate from '../pages/wallet/create';
import WalletRecovery from '../pages/wallet/recovery';
import RecoveryPhrase from '../pages/wallet/recovery.phrase';
import WalletList from '../pages/wallet/list';
import VerifyPhrase from '../pages/wallet/verify.phrase';
import VerifyPhraseSuccess from '../pages/wallet/verify.phrase.success';
import VerifyPasscode from '../pages/wallet/verify.passcode';
import VerifyFingerprint from '../pages/wallet/verify.fingerprint';
import Transfer from '../pages/wallet/transfer';
import TransferCompleted from '../pages/wallet/transfer.completed';
import WalletReceive from '../pages/wallet/receive';
import WalletHistory from '../pages/wallet/history';
import Scan from '../pages/wallet/scan';
import StartPage from '../pages/start/start';
import TermsPage from '../pages/start/terms';
import MineIndex from '../pages/mine/index';
import Language from '../pages/mine/language';
import Currency from '../pages/mine/currency';
import TwoFactorAuth from '../pages/mine/two.factor.auth';
import ResetPasscode from '../pages/mine/reset.passcode';
import ResetPasscodeSuccess from '../pages/mine/reset.passcode.success';

const defaultNavigationOptions = () => ({ navigation }) => {
  common.currentNavigation = navigation;
  return {
    headerTitle: '',
    headerRight: <Text />,
    headerLeft: <BackBtn navigation={navigation} />,
    headerForceInset: {
      top: 'always', // always/显示、never/隐藏
    },
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
  };
};

const routeConfigMap = {
  home: {
    WalletAddIndex: {
      screen: WalletAddIndex,
      path: 'WalletAddIndex',
      navigationOptions: () => ({
        headerTitle: 'Add Wallet',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    WalletSelectCurrency: {
      screen: WalletSelectCurrency,
      path: 'WalletSelectCurrency',
      navigationOptions: () => ({
        headerTitle: 'Select Wallet Currency',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    WalletCreate: {
      screen: WalletCreate,
      path: 'WalletCreate',
      navigationOptions: () => ({
        headerTitle: 'Create Wallet',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    WalletRecovery: {
      screen: WalletRecovery,
      path: 'WalletRecovery',
      navigationOptions: () => ({
        headerTitle: 'Recovery Wallet',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    RecoveryPhrase: {
      screen: RecoveryPhrase,
      path: 'RecoveryPhrase',
      navigationOptions: () => ({
        headerTitle: 'Recovery Phrase',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    WalletList: {
      screen: WalletList,
      path: 'WalletList',
      navigationOptions: () => ({
        headerTitle: 'Wallet List',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    StartPage: {
      screen: StartPage,
      path: 'StartPage',
      navigationOptions: () => ({
        headerTitle: 'StartPage',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    TermsPage: {
      screen: TermsPage,
      path: 'TermsPage',
      navigationOptions: () => ({
        headerTitle: 'TermsPage',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    VerifyPhrase: {
      screen: VerifyPhrase,
      path: 'VerifyPhrase',
      navigationOptions: () => ({
        headerTitle: 'VerifyPhrase',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    VerifyPhraseSuccess: {
      screen: VerifyPhraseSuccess,
      path: 'VerifyPhraseSuccess',
      navigationOptions: () => ({
        headerTitle: 'VerifyPhraseSuccess',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    Transfer: {
      screen: Transfer,
      path: 'Transfer',
      navigationOptions: () => ({
        headerTitle: 'Transfer',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    TransferCompleted: {
      screen: TransferCompleted,
      path: 'TransferCompleted',
      navigationOptions: () => ({
        headerTitle: 'TransferCompleted',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    WalletReceive: {
      screen: WalletReceive,
      path: 'WalletReceive',
      navigationOptions: () => ({
        headerTitle: 'WalletReceive',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    WalletHistory: {
      screen: WalletHistory,
      path: 'WalletHistory',
      navigationOptions: () => ({
        headerTitle: 'WalletHistory',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    VerifyPasscode: {
      screen: VerifyPasscode,
      path: 'VerifyPasscode',
      navigationOptions: () => ({
        headerTitle: 'VerifyPasscode',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    VerifyFingerprint: {
      screen: VerifyFingerprint,
      path: 'VerifyFingerprint',
      navigationOptions: () => ({
        headerTitle: 'VerifyFingerprint',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    Scan: {
      screen: Scan,
      path: 'Scan',
      navigationOptions: () => ({
        headerTitle: 'Scan',
        headerRight: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
  },
  mine: {
    MineIndex: {
      screen: MineIndex,
      path: 'MineIndex',
      navigationOptions: () => ({
        headerTitle: 'Mine',
        headerRight: <Text />,
        headerLeft: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    Language: {
      screen: Language,
      path: 'Language',
      navigationOptions: () => ({
        headerTitle: 'Language',
        headerRight: <Text />,
        headerLeft: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    Currency: {
      screen: Currency,
      path: 'Currency',
      navigationOptions: () => ({
        headerTitle: 'Currency',
        headerRight: <Text />,
        headerLeft: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    TwoFactorAuth: {
      screen: TwoFactorAuth,
      path: 'TwoFactorAuth',
      navigationOptions: () => ({
        headerTitle: 'TwoFactorAuth',
        headerRight: <Text />,
        headerLeft: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    ResetPasscode: {
      screen: ResetPasscode,
      path: 'ResetPasscode',
      navigationOptions: () => ({
        headerTitle: 'ResetPasscode',
        headerRight: <Text />,
        headerLeft: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
    ResetPasscodeSuccess: {
      screen: ResetPasscodeSuccess,
      path: 'ResetPasscodeSuccess',
      navigationOptions: () => ({
        headerTitle: 'ResetPasscode',
        headerRight: <Text />,
        headerLeft: <Text />,
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
      }),
    },
  },
};

function hasEqualKey(obj1, obj2) {
  for (const o1 in obj1) {
    for (const o2 in obj2) {
      if (o1 === o2) {
        return o1;
      }
    }
  }
  return false;
}

const routeConfigMaps = (() => {
  let ret = {};
  for (const key in routeConfigMap) {
    const crt = routeConfigMap[key];
    const equalKey = hasEqualKey(ret, crt);
    if (equalKey) {
      console.error(`导航配置地图错误，定义了相同名称:${equalKey}`);
    }
    ret = { ...ret, ...crt };
  }
  return ret;
})();

export { defaultNavigationOptions, routeConfigMaps };
