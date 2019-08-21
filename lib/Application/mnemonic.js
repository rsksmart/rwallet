"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var bipWords = require('./WordList');
const crypto_1 = require("crypto");
let generate_secure_random = null;
function set_generate_secure_random(f) {
    generate_secure_random = f;
}
exports.set_generate_secure_random = set_generate_secure_random;
function bytes_to_binary(bytes) {
    return bytes
        .map(x => {
        let ret = x.toString(2);
        while (ret.length < 8)
            ret = '0' + ret;
        return ret;
    })
        .join('');
}
function buffer_to_number_array(b) {
    let ret = [];
    for (let i = 0; i < b.length; i++)
        ret.push(b[i]);
    return ret;
}
function buffer_to_bits(b) {
    return bytes_to_binary(buffer_to_number_array(b));
}
function generate_mnemonic() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!generate_secure_random)
            return Promise.resolve('BAD RANDOM');
        let entropy = crypto_1.createHash('sha256')
            .update(yield generate_secure_random(128))
            .digest()
            .slice(0, 16);
        let checksum = crypto_1.createHash('sha256')
            .update(entropy)
            .digest();
        let bits = buffer_to_bits(entropy) + buffer_to_bits(checksum);
        let chunks = bits.match(/(.{1,11})/g);
        if (!chunks)
            return 'MISSIN CHUNKS';
        return chunks
            .slice(0, 12)
            .map(x => {
            return bipWords[parseInt(x, 2)];
        })
            .join(' ');
    });
}
exports.generate_mnemonic = generate_mnemonic;
