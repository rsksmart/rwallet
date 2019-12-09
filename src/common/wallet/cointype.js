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
    chain: 'Bitcoin',
    type: 'Mainnet',
    symbol: 'BTC',
  },
  RBTC: {
    networkId: 137,
    icon: rbtc,
    queryKey: 'RBTC',
    defaultName: 'SmartBitcoin',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'RBTC',
  },
  RIF: {
    networkId: 137,
    icon: rif,
    queryKey: 'RIF',
    defaultName: 'RIF',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'RIF',
  },
  BTCTestnet: {
    networkId: 1,
    network: networks.testnet,
    icon: btc,
    queryKey: 'TBTC',
    defaultName: 'Bitcoin Testnet',
    chain: 'Bitcoin',
    type: 'Testnet',
    symbol: 'BTC',
  },
  RBTCTestnet: {
    networkId: 37310,
    icon: rbtc,
    queryKey: 'TRBTC',
    defaultName: 'SmartBitcoin Testnet',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'RBTC',
  },
  RIFTestnet: {
    networkId: 37310,
    icon: rif,
    queryKey: 'TRIF',
    defaultName: 'RIF Testnet',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'RIF',
  },
};

export default coinType;
