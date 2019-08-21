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
const fs_1 = require("fs");
function do_postprocessing(input_path, output_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const require_variable_name = 'rn_require';
        const export_variable_name = 'nktCustomExport';
        let data = yield new Promise((resolve, reject) => {
            fs_1.readFile(input_path, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
        let contents = data.toString('utf8');
        contents = contents.replace(/([^0-9A-Za-z_])require([^0-9A-Za-z_])/g, '$1' + require_variable_name + '$2');
        contents = contents.replace('exports.Application = Application;', export_variable_name + ' = Application;');
        contents =
            'var ' +
                export_variable_name +
                ' = null;\n' +
                contents +
                '\n' +
                'module.exports.Application = ' +
                export_variable_name +
                ';\n';
        yield new Promise((resolve, reject) => {
            fs_1.writeFile(output_path, contents, err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        console.log('Completed without errors!');
    });
}
exports.do_postprocessing = do_postprocessing;
