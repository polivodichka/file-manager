
import path from 'path';
import fs from 'fs';
import { throwOperationFailed } from './errors.js';

export const up = (currentPath) => {
    return path.resolve(currentPath, '..')
}

export const cd = (currentPath, additional) => {
    const newPath = path.resolve(currentPath, additional);
    if(!fs.existsSync(newPath)) throwOperationFailed('No such file or directory!');
    else if(!fs.lstatSync(newPath).isDirectory()) throwOperationFailed('No such directory!');
    return fs.existsSync(newPath) && fs.lstatSync(newPath).isDirectory() ? newPath : currentPath;
}

export const list = async (folder) => {
    return fs.promises.readdir(folder);
}