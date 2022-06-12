import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { throwOperationFailed } from './errors.js';

export const compress = ([toRead, toWrite]) => {
    console.log(toRead, fs.existsSync(toWrite))
    if (toRead && !fs.existsSync(toWrite)) {
        fs.mkdirSync(toWrite, () => { })
    }
    if (!(toRead && fs.existsSync(toWrite))) {
        throwOperationFailed('No such file in this derictory!');
        return;
    }
    const input = fs.createReadStream(toRead);
    const output = fs.createWriteStream(path.resolve(toWrite, `${path.basename(toRead)}.br`));
    const brotli = zlib.createBrotliCompress();

    input.pipe(brotli).pipe(output);
    console.log(`Successfully compressed into ${path.resolve(toWrite, path.basename(toRead))}.br`);
};

export const decompress = ([toRead, toWrite]) => {
    if (!(toRead && fs.existsSync(toWrite))) {
        throwOperationFailed('No such file in this derictory!');
        return;
    }
    const input = fs.createReadStream(toRead);
    const output = fs.createWriteStream(path.resolve(toWrite, `${path.basename(toRead, path.extname(toRead))}`));
    const brotli = zlib.createBrotliDecompress();

    input.pipe(brotli).pipe(output);
    console.log(`Successfully decompressed into ${path.resolve(toWrite, path.basename(toRead, path.extname(toRead)))}`);
};