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
