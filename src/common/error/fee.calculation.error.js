import ERROR_CODE from './error.code';
import GeneralError from './general.error';

export default class FeeCalculationError extends GeneralError {
  constructor() {
    super(ERROR_CODE.ERR_FEE_CALCULATION, 'FeeCalculationError');
  }
}
