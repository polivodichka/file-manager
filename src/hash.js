import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const getHash = async (currentDirectory, fileName, readline) => {
    await fs.readFile(path.resolve(currentDirectory, fileName), (error, fileBuffer) => {
        if (error) {
            console.log('Invalid input');
        } else {
            console.log(crypto.createHash('sha256').update(fileBuffer).digest('hex'));
        }
        readline.prompt();
    });
}