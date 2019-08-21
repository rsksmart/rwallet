"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Exchange {
}
exports.Exchange = Exchange;
class ExchangeModel1 extends Exchange {
    get_model() {
        return 1;
    }
}
exports.ExchangeModel1 = ExchangeModel1;
class ExchangeEstimation1 {
    constructor(src, fees, dst) {
        this.src_amount = src;
        this.fees = fees;
        this.dst_amount = dst;
    }
}
exports.ExchangeEstimation1 = ExchangeEstimation1;
