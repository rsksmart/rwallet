import { readFile, writeFile } from 'fs';

export async function do_postprocessing(input_path: string, output_path: string) {
    const require_variable_name = 'rn_require';
    const export_variable_name = 'nktCustomExport';

    let data = await new Promise<Buffer>((resolve, reject) => {
        readFile(input_path, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
    let contents = data.toString('utf8');
    contents = contents.replace(
        /([^0-9A-Za-z_])require([^0-9A-Za-z_])/g,
        '$1' + require_variable_name + '$2'
    );
    contents = contents.replace(
        'exports.Application = Application;',
        export_variable_name + ' = Application;'
    );
    contents =
        'var ' +
        export_variable_name +
        ' = null;\n' +
        contents +
        '\n' +
        'module.exports.Application = ' +
        export_variable_name +
        ';\n';

    await new Promise<void>((resolve, reject) => {
        writeFile(output_path, contents, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
    console.log('Completed without errors!');
}
