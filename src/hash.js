import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { throwOperationFailed } from './errors.js';

export const getHash = async (currentDirectory, fileName, readline) => {
    await fs.readFile(path.resolve(currentDirectory, fileName), (error, fileBuffer) => {
        if (error) {
            throwOperationFailed('No such file!');
        } else {
            console.log(crypto.createHash('sha256').update(fileBuffer).digest('hex'));
        }
        readline.prompt();
    });
}