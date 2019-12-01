// BTC TBTC RBTC TRBTC RIF TRIF
import { networks } from 'bitcoinjs-lib';

const btc = require('../../assets/images/icon/BTC.png');
const rbtc = require('../../assets/images/icon/RBTC.png');
const rif = require('../../assets/images/icon/RIF.png');

const coinType = {
  BTC: {
    networkId: 0,
    network: networks.bitcoin,
    icon: btc,
    queryKey: 'BTC',
    defaultName: 'Bitcoin',
  },
  RBTC: {
    networkId: 137,
    icon: rbtc,
    queryKey: 'RBTC',
    defaultName: 'SmartBitcoin',
  },
  RIF: {
    networkId: 137,
    icon: rif,
    queryKey: 'RIF',
    defaultName: 'RIF',
  },
  BTCTestNet: {
    networkId: 1,
    network: networks.testnet,
    icon: btc,
    queryKey: 'TBTC',
    defaultName: 'Bitcoin Testnet',
  },
  RBTCTestNet: {
    networkId: 37310,
    icon: rbtc,
    queryKey: 'TRBTC',
    defaultName: 'SmartBitcoin Testnet',
  },
  RIFTestNet: {
    networkId: 37310,
    icon: rif,
    queryKey: 'TRIF',
    defaultName: 'RIF Testnet',
  },
};

export default coinType;
