"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SendTxResult {
    constructor(success, tx_hash) {
        this.success = success;
        this.tx_hash = tx_hash;
    }
}
exports.SendTxResult = SendTxResult;
