import ERROR_CODE from './error.code';
import GeneralError from './general.error';

export default class InsufficientRbtcError extends GeneralError {
  constructor() {
    super(ERROR_CODE.NOT_ENOUGH_RBTC, 'InsufficientRbtcError');
  }
}
