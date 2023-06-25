import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';

import { throwOperationFailed } from './errors.js';

export const read = async (currentPath, toRead, readline) => {
    const stream = fs.ReadStream(path.resolve(currentPath, toRead), 'utf8');

    stream.on('error', () => throwOperationFailed('No such file in this directory!'));
    stream.on('data', data => process.stdout.write(`${data} \n`));
    stream.on('close', () => readline.prompt());
};

export const create = async (currentPath, name, readline) => {
    let freshPath = path.resolve(currentPath, name);

    fs.writeFile(freshPath, '', { flag: 'wx' }, (err) => {
        if (err) throwOperationFailed('File already exists!') //проверить файл это или директория или просто вывести падение
        readline.prompt();
    });
};

export const rename = async ([oldPath, newPath], readline) => {

    try {
        await fsPromises.rename(oldPath, newPath);
    } catch {
        throwOperationFailed('No such file in this derictory!')
    }

    readline.prompt();
};

export const copy = async ([src, dest], readline) => {
    if (!src) {
        throwOperationFailed('No such file in this derictory!');
        if (readline) readline.prompt();
        return;
    }
    else if (!fs.lstatSync(src).isFile()){
        throwOperationFailed('You are trying to copy a folder!');
        if (readline) readline.prompt();
        return;
    }
    else if (!fs.existsSync(dest) || fs.lstatSync(dest).isFile()) {
        try {
            await fs.promises.mkdir(dest);
        } catch {
            throwOperationFailed('The specified folder name matches the file name in the current directory!');
            if (readline) readline.prompt();
            return;
        }
    }
    const fileName = path.parse(src);
    let newFileName = `${fileName.name}${fileName.ext}`
    let counter = 0
    while (fs.existsSync(path.resolve(dest, newFileName))) {
        counter++;
        newFileName = `${fileName.name}(${counter})${fileName.ext}`
    }

    const readableStream = fs.ReadStream(src, 'utf8');
    const writableStream = fs.WriteStream(path.resolve(dest, newFileName));

    readableStream.on('error', () => throwOperationFailed());
    readableStream.on('error', () => throwOperationFailed());

    readableStream.pipe(writableStream);

    if (readline) readline.prompt();
    else return true;
};

export const move = async ([src, dest], readline) => {
    
    if (!fs.lstatSync(src).isFile()){
        throwOperationFailed('You are trying to move a folder!');
        if (readline) readline.prompt();
        return;
    }
    else if (!fs.existsSync(path.resolve(dest, path.basename(src))))
        copy([src, dest], false).then(data => {
            if (data) remove(src, false);
            readline.prompt();
        });
    else {
        throwOperationFailed('File already exist, specify another directory!')
        readline.prompt();
    }

};

export const remove = async (src, readline) => {
    fs.rm(src, (error) => {
        if (error) {
            throwOperationFailed('No such file in this derictory!')
        }
        if (readline) readline.prompt();
    })
};