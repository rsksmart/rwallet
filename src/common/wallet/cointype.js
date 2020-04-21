// BTC TBTC RBTC TRBTC RIF TRIF
import { networks } from 'bitcoinjs-lib';
import references from '../../assets/references';

const coinType = {
  BTC: {
    networkId: 0,
    network: networks.bitcoin,
    icon: references.images.BTC,
    queryKey: 'BTC',
    defaultName: 'Bitcoin',
    chain: 'Bitcoin',
    type: 'Mainnet',
    symbol: 'BTC',
  },
  RBTC: {
    networkId: 137,
    icon: references.images.RBTC,
    queryKey: 'RBTC',
    defaultName: 'SmartBitcoin',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'RBTC',
  },
  RIF: {
    networkId: 137,
    icon: references.images.RIF,
    queryKey: 'RIF',
    defaultName: 'RIF',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'RIF',
  },
  DOC: {
    networkId: 137,
    icon: references.images.DOC,
    queryKey: 'DOC',
    defaultName: 'DOC',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'DOC',
  },
  BTCTestnet: {
    networkId: 1,
    network: networks.testnet,
    icon: references.images.BTC,
    queryKey: 'TBTC',
    defaultName: 'Bitcoin',
    chain: 'Bitcoin',
    type: 'Testnet',
    symbol: 'BTC',
  },
  RBTCTestnet: {
    networkId: 37310,
    icon: references.images.RBTC,
    queryKey: 'TRBTC',
    defaultName: 'SmartBitcoin',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'RBTC',
  },
  RIFTestnet: {
    networkId: 37310,
    icon: references.images.RIF,
    queryKey: 'TRIF',
    defaultName: 'RIF',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'RIF',
  },
  DOCTestnet: {
    networkId: 37310,
    icon: references.images.DOC,
    queryKey: 'DOC',
    defaultName: 'DOC',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'DOC',
  },
};

export default coinType;
