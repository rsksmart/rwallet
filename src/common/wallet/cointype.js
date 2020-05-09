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
    defaultName: 'Smart Bitcoin',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'RBTC',
  },
  RIF: {
    networkId: 137,
    icon: references.images.RIF,
    queryKey: 'RIF',
    defaultName: 'RSK Infra Framework',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'RIF',
  },
  DOC: {
    networkId: 137,
    icon: references.images.DOC,
    queryKey: 'DOC',
    defaultName: 'Dollar on Chain',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'DOC',
  },
  BTCTestnet: {
    networkId: 1,
    network: networks.testnet,
    icon: references.images.BTC_GREY,
    queryKey: 'TBTC',
    defaultName: 'Bitcoin',
    chain: 'Bitcoin',
    type: 'Testnet',
    symbol: 'BTC',
  },
  RBTCTestnet: {
    networkId: 37310,
    icon: references.images.RBTC_GREY,
    queryKey: 'TRBTC',
    defaultName: 'Smart Bitcoin',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'RBTC',
  },
  RIFTestnet: {
    networkId: 37310,
    icon: references.images.RIF_GREY,
    queryKey: 'TRIF',
    defaultName: 'RSK Infra Framework',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'RIF',
  },
  DOCTestnet: {
    networkId: 37310,
    icon: references.images.DOC_GREY,
    queryKey: 'DOC',
    defaultName: 'Dollar on Chain',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'DOC',
  },
  CustomToken: {
    networkId: 137,
    icon: references.images.customToken,
    chain: 'Rootstock',
    type: 'Mainnet',
  },
  CustomTokenTestnet: {
    networkId: 37310,
    icon: references.images.customToken_grey,
    chain: 'Rootstock',
    type: 'Testnet',
  },
};

export default coinType;
