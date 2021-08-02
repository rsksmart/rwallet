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
    Testnet: '0x19f64674D8a5b4e652319F5e239EFd3bc969a1FE',
    Mainnet: '0x2aCc95758f8b5F583470bA265Eb685a8f45fC9D5',
  },
  DOC: {
    Testnet: '0xCb46C0DdC60d18eFEB0e586c17AF6Ea36452DaE0',
    Mainnet: '0xE700691Da7B9851F2F35f8b8182C69C53ccad9DB',
  },
  RIFP: {
    Testnet: '0x23A1Aa7B11E68beBE560a36bEC04D1F79357f28d',
    Mainnet: '0xF4d27C56595eD59B66cC7f03CFF5193E4Bd74a61',
  },
  RDOC: {
    Testnet: '0xC3De9f38581F83e281F260D0ddBAac0E102Ff9F8',
    Mainnet: '0x2d919f19D4892381d58EdEbEcA66D5642ceF1A1F',
  },
  BITP: {
    Testnet: '0x30c7AddAb4b6e17Bfa71a78c8116C157Df4f6a4b',
    Mainnet: '0x440cd83C160de5C96DDb20246815EA44C7Abbca8',
  },
  'T!': {
    Testnet: '0x42ced11891E641F15Acae3F540378052C37F5B00',
    Mainnet: '0xaf8C226013BDc4b3AACe1F8060Db645b3F5E53FC',
  },
  TTE: {
    Testnet: '0xe30f71ade0f4af9e134fb8f480bc82d15d582d99',
  },
  BRZ: {
    Testnet: '0x06d164E8d6829E1dA028A4F745d330Eb764Dd3aC',
    Mainnet: '0xe355c280131DfaF18bf1C3648aee3c396db6b5FD',
  },
};

export const WALLET_CONNECT = {
  MODAL_TYPE: {
    CONFIRMATION: 'Confirmation',
    NOTIFICATION: 'Notification',
  },
  ASSETS: ['RBTC', 'RIF', 'DOC', 'RIFP', 'RDOC', 'BITP', 'TTE', 'BRZ'],
};

export const TRANSACTION = {
  DEFAULT_GAS_LIMIT: '0x927c0',
  DEFAULT_GAS_PRICE: '0x47868C00',
  DEFAULT_VALUE: '0x0',
};

export const TIMEOUT_VALUE = {
  WALLET_CONNECT: 20000, // 20 sec
};

// sorted by popularity according to https://www.datagenetics.com/blog/september32012/
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
