import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { throwOperationFailed } from './errors.js';

export const getHash = async (currentDirectory, fileName, readline) => {
    try {
        const data = fs.readFileSync(path.resolve(currentDirectory, fileName));
        console.log(crypto.createHash('sha256').update(`${data}\n`).digest('hex'));
    }
    catch {
        throwOperationFailed()
    }
    readline.prompt()
}