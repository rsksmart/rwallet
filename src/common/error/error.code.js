const ERROR_CODE = {
  ERR_SERVICE_UNAVAILABLE: 2, // parse error code: service unavailable
  ERR_REQUEST_TIMEOUT: 124,

  ERR_ADDR_EXIST: 700, // address already exist in database
  ERR_SAVE_TO_DB: 701, // save data to database fail due to error
  ERR_FCM: 702, // call firebase admin sdk error
  ERR_INPUT_PARAM: 703, // input params not valid
  ERR_ADDRESS_INVALID: 705, // address is a invalid address

  ERR_API_KEY_NOT_EXIST: 710, // apiKey not exist
  ERR_API_KEY_INVALID: 711, // apiKey invalid
  ERR_ROLE_NOT_EXIST: 712, // access role not exist
  ERR_ROLE_NOT_SUPPORT_API: 713, // access role not exist
  ERR_API_EXCEED_THRESHOLD: 714, // access role not exist
  ERR_QUERY_ACCESS_DB: 715, // query access_x collection fail
  ERR_SYMBOL_TYPE_TOKEN: 716, // already exist same symbol type token
  ERR_EXCEED_RNS_QUOTA: 717, // exceed rns create subdomain daily quota
  ERR_SYMBOL_NOT_FOUND: 718, // token not found with given symbol and type

  NOT_ENOUGH_RBTC: 720,
  NOT_ENOUGH_BTC: 721,
  NOT_ENOUGH_BALANCE: 722,
  INCORRECT_NETWORK_NAME: 723,
  ERC20_CONTRACT_NOT_FOUND: 724,
  TIME_OUT: 725,

  ERR_FEE_CALCULATION: 5001,
  ERR_INVALID_ADDRESS: 5002,
  ERR_INVALID_AMOUNT: 5003,
  ERR_INVALID_PARAM: 5004,
};

export default ERROR_CODE;
