import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { throwOperationFailed } from './errors.js';

export const getHash = async (currentDirectory, fileName, readline) => {
    const stream = fs.ReadStream(path.resolve(currentDirectory, fileName));

    stream.on('error', () => throwOperationFailed('No such file in this directory!'));
    stream.on('data', data => console.log(crypto.createHash('sha256').update(data).digest('hex')));
    stream.on('close', () => readline.prompt());
}