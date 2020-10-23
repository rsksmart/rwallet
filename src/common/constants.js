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
    Testnet: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
    Mainnet: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
  },
  DOC: {
    Testnet: '0xcb46c0ddc60d18efeb0e586c17af6ea36452dae0',
    Mainnet: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
  },
  RIFP: {
    Testnet: '0x23a1aa7b11e68bebe560a36bec04d1f79357f28d',
    Mainnet: '0xf4d27c56595ed59b66cc7f03cff5193e4bd74a61',
  },
  RDOC: {
    Testnet: '0xc3de9f38581f83e281f260d0ddbaac0e102ff9f8',
    Mainnet: '0x2d919f19d4892381d58edebeca66d5642cef1a1f',
  },
  BITP: {
    Testnet: '0x4dA7997A819bb46B6758b9102234c289Dd2ad3bf',
    Mainnet: '0x440cd83c160de5c96ddb20246815ea44c7abbca8',
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
};

export const TRANSACTION = {
  DEFAULT_GAS_LIMIT: '0x927c0',
  DEFAULT_GAS_PRICE: '1200000000',
  DEFAULT_VALUE: '0x0',
};

export const TIMEOUT_VALUE = {
  WALLET_CONNECT: 20000, // 20 sec
};
