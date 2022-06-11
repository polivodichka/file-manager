
import path from 'path';
import fs from 'fs';

export const up = (currentPath) => {
    return path.resolve(currentPath, '..')
}
export const cd = (currentPath, additional) => {
    const newPath = path.resolve(currentPath, additional);
    return fs.existsSync(newPath) && list(newPath) ? newPath : currentPath;
}
export const list = async (folder, readline) => {
    return fs.readdir(folder, (err) => {
        if (err) {
            return false;
        }
    });
}