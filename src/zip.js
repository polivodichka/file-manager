import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

export const compress = ([toRead, toWrite]) => {
    if (!(toRead && fs.existsSync(toWrite))){
        try {
            throw new Error('Error!')
        } catch (error) {
            console.log(error.message)
            return;
        }
    }
    const input = fs.createReadStream(toRead);
    const output = fs.createWriteStream(path.resolve(toWrite, `${path.basename(toRead)}.br`));
    const brotli = zlib.createBrotliCompress();

    input.pipe(brotli).pipe(output);
    console.log(`Successfully compressed into ${path.basename(toRead)}.br`);
};

export const decompress = ([toRead, toWrite]) => {
    if (!(toRead && fs.existsSync(toWrite))){
        try {
            throw new Error('Error!')
        } catch (error) {
            console.log(error.message)
            return;
        }
    }
    const input = fs.createReadStream(toRead);
    const output = fs.createWriteStream(path.resolve(toWrite, `${path.basename(toRead, path.extname(toRead))}`));
    const brotli = zlib.createBrotliDecompress(); 

    input.pipe(brotli).pipe(output);
    console.log(`Successfully decompressed into ${path.basename(toRead, path.extname(toRead))}`)
};