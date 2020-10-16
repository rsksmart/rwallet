import ERROR_CODE from './error.code';
import GeneralError from './general.error';

export default class InvalidAddressError extends GeneralError {
  constructor() {
    super(ERROR_CODE.ERR_INVALID_ADDRESS, 'InvalidAddressError');
  }
}
