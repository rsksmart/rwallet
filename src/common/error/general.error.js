export default class GeneralError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
