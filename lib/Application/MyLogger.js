"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmptyLogger {
    debug(...args) { }
    info(...args) { }
    warn(...args) { }
    error(...args) { }
}
class LoggerImpl {
    constructor() {
        this._logger = new EmptyLogger();
    }
    // eslint-disable-next-line no-unused-vars
    debug(...args) {
        this._logger.debug(...args);
    }
    info(...args) {
        this._logger.info(...args);
    }
    warn(...args) {
        this._logger.warn(...args);
    }
    error(...args) {
        this._logger.error(...args);
    }
    setLogger(l) {
        this._logger = l;
    }
}
exports.MyLogger = new LoggerImpl();
