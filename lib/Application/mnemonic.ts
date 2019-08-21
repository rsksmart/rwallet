var bipWords = require('./WordList');
import { GenerateSecureRandom } from './Application';
import { createHash } from 'crypto';

let generate_secure_random: GenerateSecureRandom | null = null;

export function set_generate_secure_random(f: GenerateSecureRandom) {
    generate_secure_random = f;
}

function bytes_to_binary(bytes: number[]): string {
    return bytes
        .map(x => {
            let ret = x.toString(2);
            while (ret.length < 8) ret = '0' + ret;
            return ret;
        })
        .join('');
}

function buffer_to_number_array(b: Buffer): number[] {
    let ret: number[] = [];
    for (let i = 0; i < b.length; i++) ret.push(b[i]);
    return ret;
}

function buffer_to_bits(b: Buffer): string {
    return bytes_to_binary(buffer_to_number_array(b));
}

export async function generate_mnemonic(): Promise<string> {
    if (!generate_secure_random) return Promise.resolve('BAD RANDOM');

    let entropy = createHash('sha256')
        .update(await generate_secure_random(128))
        .digest()
        .slice(0, 16);
    let checksum = createHash('sha256')
        .update(entropy)
        .digest();
    let bits = buffer_to_bits(entropy) + buffer_to_bits(checksum);

    let chunks = bits.match(/(.{1,11})/g);
    if (!chunks) return 'MISSIN CHUNKS';
    return chunks
        .slice(0, 12)
        .map(x => {
            return bipWords[parseInt(x, 2)];
        })
        .join(' ');
}
