import ERROR_CODE from './error.code';
import GeneralError from './general.error';

export default class ExistUnfinishedProposalError extends GeneralError {
  constructor() {
    super(ERROR_CODE.ERR_EXIST_UNFINISHED_PROPOSAL, 'ExistUnfinishedProposalError');
  }
}
