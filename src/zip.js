import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { throwOperationFailed } from './errors.js';

export const compress = ([toRead, toWrite]) => {

    if (toRead && fs.lstatSync(toRead).isFile() && !fs.existsSync(toWrite)) {
        fs.mkdirSync(toWrite, () => { })
    }

    if (!(toRead && fs.lstatSync(toRead).isFile() && fs.existsSync(toWrite))) {
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

    if (toRead && fs.lstatSync(toRead).isFile() && !fs.existsSync(toWrite)) {
        fs.mkdirSync(toWrite, () => { })
    }
    else if (!(toRead && fs.lstatSync(toRead).isFile() && fs.existsSync(toWrite))) {
        throwOperationFailed('No such file in this derictory!');
        return;
    }
    else if(path.extname(toRead) !== '.br'){
        throwOperationFailed('Invalid extesion!');
        return;
    }
    const input = fs.createReadStream(toRead);
    const output = fs.createWriteStream(path.resolve(toWrite, `${path.basename(toRead, path.extname(toRead))}`));
    const brotli = zlib.createBrotliDecompress();

    input.pipe(brotli).pipe(output);
    console.log(`Successfully decompressed into ${path.resolve(toWrite, path.basename(toRead, path.extname(toRead)))}`);
};