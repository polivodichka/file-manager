import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream';
import { throwOperationFailed } from './errors.js';

export const read = async (currentPath, toRead, readline) => {
    const stream = fs.ReadStream(path.resolve(currentPath, toRead), 'utf8');

    stream.on('error', () => throwOperationFailed('No such file in this directory!'));
    stream.on('data', data => process.stdout.write(data));
    stream.on('close', () => readline.prompt());
};

export const create = async (currentPath, name, readline) => {
    let freshPath = path.resolve(currentPath, name);

    fs.writeFile(freshPath, '', { flag: 'wx' }, (err) => {
        if (err) throwOperationFailed('File already exists!')
        readline.prompt();
    });
};

export const rename = async ([oldPath, newPath], readline) => {

    try {
        await fsPromises.rename(oldPath, newPath);
    } catch {
        throwOperationFailed('No such file in this directiry!')
    }

    readline.prompt();
};

export const copy = async ([src, dest], readline) => {

    if (!src) {
        throwOperationFailed('No such file!');
        if (readline) readline.prompt();
        return;
    }
    else if (!fs.existsSync(dest)) {
        await fs.promises.mkdir(dest);
    }

    const readableStream = fs.ReadStream(src, 'utf8');
    const writableStream = fs.WriteStream(path.resolve(dest, path.basename(src)));

    readableStream.on('error', () => throwOperationFailed());
    readableStream.on('error', () => throwOperationFailed());

    readableStream.pipe(writableStream);

    if (readline) readline.prompt();
    else return true;
};

export const move = async ([src, dest], readline) => {
    copy([src, dest], false).then(data => {
        if (data) remove(src, false); 
        readline.prompt();
    });
};

export const remove = async (src, readline) => {
    fs.rm(src, (error) => {
        if (error) {
            throwOperationFailed('No such file!')
        }
        if (readline) readline.prompt();
    })
};