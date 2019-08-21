"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractTxEstimation {
    constructor(amount, fee, total) {
        this.amount = amount;
        this.fees = fee;
        this.total = total;
    }
}
exports.AbstractTxEstimation = AbstractTxEstimation;
