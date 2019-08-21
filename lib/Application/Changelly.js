"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Exchange_1 = require("./Exchange");
const Wallet_1 = require("./Wallet");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
class ChangellyEstimation extends Exchange_1.ExchangeEstimation1 {
    constructor(app, src, fees, dst, src_wallet, dst_wallet) {
        super(src, fees, dst);
        this.app = app;
        this.src_wallet = src_wallet;
        this.dst_wallet = dst_wallet;
    }
    confirm() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let src_network = this.src_wallet.get_network_object();
                let dst_network = this.dst_wallet.get_network_object();
                let response = yield this.app.server_get_request('/doExchange?quantity=' +
                    this.src_amount.value +
                    '&destinationAddr=' +
                    (yield this.dst_wallet.get_receive_address()) +
                    '&fromCoin=' +
                    src_network.name +
                    '&toCoin=' +
                    dst_network.name);
                let estimation = yield this.src_wallet.estimate_tx(response, this.src_amount.value, Wallet_1.FeeWeight.Normal);
                estimation
                    .confirm()
                    .then(resolve)
                    .catch(reject);
            }
            catch (e) {
                reject(e);
            }
        }));
    }
}
class Changelly extends Exchange_1.ExchangeModel1 {
    constructor(app) {
        super();
        this.app = app;
    }
    estimate_exchange(src, dst, src_amount) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let amount = new bignumber_js_1.default(src_amount);
            let src_network = src.get_network_object();
            let dst_network = dst.get_network_object();
            let atoms = amount.multipliedBy(src_network.unit_to_atom);
            //TODO: /exchangeEstimation should be accepting atoms, not units.
            let dst_amount_p = this.app.server_get_request('/exchangeEstimation?quantity=' +
                amount.toString() +
                '&fromCoin=' +
                src_network.name +
                '&toCoin=' +
                dst_network.name);
            let converted_p = this.app.currency_conversion(src_amount, src_network.name, dst_network.name);
            try {
                let dst_amount = new bignumber_js_1.default(yield dst_amount_p);
                let converted = new bignumber_js_1.default(yield converted_p).multipliedBy(dst_network.unit_to_atom);
                let fees = converted.minus(dst_amount);
                let estimation = new ChangellyEstimation(this.app, yield this.app.construct_Amount(amount, src_network, true), yield this.app.construct_Amount(fees.dividedBy(dst_network.unit_to_atom), dst_network, true), yield this.app.construct_Amount(dst_amount.dividedBy(dst_network.unit_to_atom), dst_network, true), src, dst);
                resolve(estimation);
            }
            catch (e) {
                reject(e);
            }
        }));
    }
}
exports.Changelly = Changelly;
