// BTC TBTC RBTC TRBTC RIF TRIF
import { networks } from 'bitcoinjs-lib';
import references from '../../assets/references';
import { ASSETS_CONTRACT } from '../constants';

const coinType = {
  BTC: {
    networkId: 0,
    coinType: 0,
    network: networks.bitcoin,
    icon: references.images.BTC,
    defaultName: 'Bitcoin',
    chain: 'Bitcoin',
    type: 'Mainnet',
    symbol: 'BTC',
    precision: 8,
  },
  RBTC: {
    networkId: 30,
    coinType: 137,
    icon: references.images.RBTC,
    defaultName: 'Smart Bitcoin',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'RBTC',
    precision: 18,
  },
  RIF: {
    networkId: 30,
    coinType: 137,
    icon: references.images.RIF,
    defaultName: 'RSK Infra Framework',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'RIF',
    contractAddress: ASSETS_CONTRACT.RIF.Mainnet,
    precision: 18,
  },
  DOC: {
    networkId: 30,
    coinType: 137,
    icon: references.images.DOC,
    defaultName: 'Dollar on Chain',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'DOC',
    contractAddress: ASSETS_CONTRACT.DOC.Mainnet,
    precision: 18,
  },
  RIFP: {
    networkId: 30,
    coinType: 137,
    icon: references.images.RIFP,
    defaultName: 'RIFPro',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'RIFP',
    contractAddress: ASSETS_CONTRACT.RIFP.Mainnet,
    precision: 18,
  },
  RDOC: {
    networkId: 30,
    coinType: 137,
    icon: references.images.RDOC,
    defaultName: 'RIF Dollar on Chain',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'RDOC',
    contractAddress: ASSETS_CONTRACT.RDOC.Mainnet,
    precision: 18,
  },
  BITP: {
    networkId: 30,
    coinType: 137,
    icon: references.images.BITP,
    defaultName: 'BitPRO',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'BITP',
    contractAddress: ASSETS_CONTRACT.BITP.Mainnet,
    precision: 18,
  },
  BRZ: {
    networkId: 30,
    coinType: 137,
    icon: references.images.BRZ,
    defaultName: 'Brazilian Digital Token',
    chain: 'Rootstock',
    type: 'Mainnet',
    symbol: 'BRZ',
    contractAddress: ASSETS_CONTRACT.BRZ.Mainnet,
    precision: 18,
  },
  CustomToken: {
    networkId: 30,
    coinType: 137,
    icon: references.images.customToken,
    chain: 'Rootstock',
    type: 'Mainnet',
    precision: 18,
  },
  BTCTestnet: {
    networkId: 1,
    coinType: 1,
    network: networks.testnet,
    icon: references.images.BTC_GREY,
    defaultName: 'Bitcoin',
    chain: 'Bitcoin',
    type: 'Testnet',
    symbol: 'BTC',
    precision: 8,
  },
  RBTCTestnet: {
    networkId: 31,
    coinType: 37310,
    icon: references.images.RBTC_GREY,
    defaultName: 'Smart Bitcoin',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'RBTC',
    precision: 18,
  },
  RIFTestnet: {
    networkId: 31,
    coinType: 37310,
    icon: references.images.RIF_GREY,
    defaultName: 'RSK Infra Framework',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'RIF',
    contractAddress: ASSETS_CONTRACT.RIF.Testnet,
    precision: 18,
  },
  DOCTestnet: {
    networkId: 31,
    coinType: 37310,
    icon: references.images.DOC_GREY,
    defaultName: 'Dollar on Chain',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'DOC',
    contractAddress: ASSETS_CONTRACT.DOC.Testnet,
    precision: 18,
  },
  RIFPTestnet: {
    networkId: 31,
    coinType: 37310,
    icon: references.images.RIFP_GREY,
    defaultName: 'RIFPro',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'RIFP',
    contractAddress: ASSETS_CONTRACT.RIFP.Testnet,
    precision: 18,
  },
  RDOCTestnet: {
    networkId: 31,
    coinType: 37310,
    icon: references.images.RDOC_GREY,
    defaultName: 'RIF Dollar on Chain',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'RDOC',
    contractAddress: ASSETS_CONTRACT.RDOC.Testnet,
    precision: 18,
  },
  BITPTestnet: {
    networkId: 31,
    coinType: 37310,
    icon: references.images.BITP_GREY,
    defaultName: 'BitPRO',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'BITP',
    contractAddress: ASSETS_CONTRACT.BITP.Testnet,
    precision: 18,
  },
  TTETestnet: {
    networkId: 31,
    coinType: 37310,
    icon: references.images.TTE_GREY,
    defaultName: 'TTE',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'TTE',
    contractAddress: ASSETS_CONTRACT.TTE.Testnet,
    precision: 18,
  },
   BRZTestnet: {
    networkId: 31,
    coinType: 37310,
    icon: references.images.BRZ_GREY,
    defaultName: 'Brazilian Digital Token',
    chain: 'Rootstock',
    type: 'Testnet',
    symbol: 'BRZ',
    contractAddress: ASSETS_CONTRACT.BRZ.Testnet,
    precision: 4,
  },
  CustomTokenTestnet: {
    networkId: 31,
    coinType: 37310,
    icon: references.images.customToken_grey,
    chain: 'Rootstock',
    type: 'Testnet',
    precision: 18,
  },
};

export default coinType;
