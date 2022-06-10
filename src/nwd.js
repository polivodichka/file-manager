
import path from 'path';
import fs from 'fs';

export const up = (currentPath) => {
    return path.resolve(currentPath, '..')
}
export const cd = (currentPath, additional) => {
    return fs.existsSync(path.resolve(currentPath, additional))?path.resolve(currentPath, additional):currentPath;
}
export const list = async (folder, readline) => {
    return fs.promises.readdir(folder);
}