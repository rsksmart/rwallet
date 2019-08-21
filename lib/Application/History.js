"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionType;
(function (TransactionType) {
    TransactionType["Transfer"] = "transfer";
    TransactionType["Exchange"] = "exchange";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
class TransactionRecord {
    constructor(type, input, output, src, dst, timestamp, tx_hash) {
        this.type = type;
        this.input = input;
        this.output = output;
        this.src = src;
        this.dst = dst;
        this.timestamp = timestamp;
        this.tx_hash = tx_hash;
    }
}
exports.TransactionRecord = TransactionRecord;
