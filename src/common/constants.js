export const MAX_FEE_TIMES = 2;
export const PLACEHODLER_AMOUNT = 0.001;
export const NUM_OF_FEE_LEVELS = 3;

export const NAME_MAX_LENGTH = 32;
export const KEYNAME_MAX_LENGTH = 32;

export const NETWORK = {
  MAINNET: {
    RSK_END_POINT: 'https://public-node.rsk.co',
    NETWORK_VERSION: 30,
  },
  TESTNET: {
    RSK_END_POINT: 'https://public-node.testnet.rsk.co',
    NETWORK_VERSION: 31,
  },
};

export const BIOMETRY_TYPES = {
  TOUCH_ID: 'Touch ID',
  FACE_ID: 'Face ID',
  Biometrics: 'Biometrics',
};

export const SUBDOMAIN_STATUS = {
  PENDING: 0,
  SUCCESS: 1,
  FAILED: 2,
};

export const BtcAddressType = {
  legacy: 'legacy',
  segwit: 'segwit',
};

export const WalletType = {
  Normal: 'Normal',
  Readonly: 'Readonly',
};

export const TxStatus = {
  PENDING: 0,
  SUCCESS: 1,
  FAILED: 2,
};

// predefined info for every blockHeightKey
// (blockHeightRootstockMainnet, blockHeightRootstockTestnet, blockHeightBitcoinMainnet, blockHeightBitcoinTestnet)
export const blockHeightKeyInfos = {
  blockHeightRootstockMainnet: {
    chain: 'Rootstock',
    type: 'Mainnet',
  },
  blockHeightRootstockTestnet: {
    chain: 'Rootstock',
    type: 'Testnet',
  },
  blockHeightBitcoinMainnet: {
    chain: 'Bitcoin',
    type: 'Mainnet',
  },
  blockHeightBitcoinTestnet: {
    chain: 'Bitcoin',
    type: 'Testnet',
  },
};

export const blockHeightKeys = Object.keys(blockHeightKeyInfos);

export const defaultErrorNotification = {
  title: 'modal.defaultError.title',
  message: 'modal.defaultError.body',
};

export const CustomToken = 'CustomToken';

export const Chain = {
  Bitcoin: 'Bitcoin',
  Rootstock: 'Rootstock',
};

export const ASSETS_CONTRACT = {
  RIF: {
    Testnet: '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE',
    Mainnet: '0x2AcC95758f8b5F583470ba265EB685a8F45fC9D5',
  },
  DOC: {
    Testnet: '0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0',
    Mainnet: '0xe700691dA7b9851F2F35f8b8182c69c53CcaD9Db',
  },
  RIFP: {
    Testnet: '0x23A1aA7b11e68beBE560a36beC04D1f79357f28d',
    Mainnet: '0xf4d27c56595Ed59B66cC7F03CFF5193e4bd74a61',
  },
  RDOC: {
    Testnet: '0xC3De9F38581f83e281f260d0DdbaAc0e102ff9F8',
    Mainnet: '0x2d919F19D4892381D58edeBeca66D5642Cef1a1f',
  },
  BITP: {
    Testnet: '0x30c7aDdAb4B6e17bFA71a78c8116C157dF4f6a4B',
    Mainnet: '0x440CD83C160De5C96Ddb20246815eA44C7aBBCa8',
  },
  'T!': {
    Testnet: '0x42ced11891E641F15AcAe3f540378052C37f5B00',
    Mainnet: '0xaf8C226013BDC4b3AAcE1f8060db645B3f5e53fC',
  },
};

export const WALLET_CONNECT = {
  MODAL_TYPE: {
    CONFIRMATION: 'Confirmation',
    NOTIFICATION: 'Notification',
  },
  ASSETS: ['RBTC', 'RIF', 'DOC', 'RIFP', 'RDOC', 'BITP'],
};

export const TRANSACTION = {
  DEFAULT_GAS_LIMIT: '0x927c0',
  DEFAULT_GAS_PRICE: '0x47868C00',
  DEFAULT_VALUE: '0x0',
};

export const TIMEOUT_VALUE = {
  WALLET_CONNECT: 20000, // 20 sec
};

export const WEAK_PASSCODES = [
  '1234',
  '1111',
  '0000',
  '1212',
  '7777',
  '1004',
  '2000',
  '4444',
  '2222',
  '6969',
  '9999',
  '3333',
  '5555',
  '6666',
  '1122',
  '1313',
  '8888',
  '4321',
  '2001',
  '1010',
];
