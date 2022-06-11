import fs from 'fs';
import path from 'path';

export const splitCommand = (commandLine) => {
    let splitted = commandLine.split(/ +/);
    let commandName = splitted[0];
    splitted.shift();
    return [commandName, splitted.join(' ')];
}

export const splitPaths = (currentPath, paths) => {
    paths = paths.split(' ');
    let src, dest, tempPath = [];
    paths.forEach(chunk => {
        tempPath.push(chunk);
        if (!src && fs.existsSync(path.resolve(currentPath, tempPath.join(' '))))
            [src, tempPath] = [path.resolve(currentPath, tempPath.join(' ')), []];
    });
    dest = path.resolve(currentPath, tempPath.join(' '));
    return [src, dest];
}