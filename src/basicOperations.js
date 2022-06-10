import fs, { copyFile } from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import {
    exit
} from 'process';

export const read = async (currentPath, toRead, readline) => {
    const stream = fs.ReadStream(path.resolve(currentPath, toRead), 'utf8');
    stream.on('error', () => {
        try {
            throw new Error('File exist!')
        } catch (error) {
            console.log(error.message)
        }
    })
    stream.on('data', data => process.stdout.write(data));

    stream.on('close', () => {
        readline.prompt()
    })
};

export const create = async (currentPath, name, readline) => {
    let freshPath = path.resolve(currentPath, name);
    try {
        await fsPromises.writeFile(freshPath, '', {
            flag: 'wx'
        });
    } catch {
        try {
            throw new Error('File exist!')
        } catch (error) {
            console.log(error.message)
        }
    }
    readline.prompt();
};

export const rename = async (currentPath, names, readline) => {

    names = names.split(' ');
    let oldName, newName, tempName = [];
    names.forEach(chunk => {
        tempName.push(chunk);
        if (fs.existsSync(path.resolve(currentPath, tempName.join(' '))))
            [oldName, tempName] = [tempName.join(' '), []];
    });
    newName = tempName.join(' ');

    let [oldPath, newPath] = [path.resolve(currentPath, oldName), path.resolve(currentPath, newName)];
    try{
        await fsPromises.rename(oldPath, newPath);
    }catch {
        try {
            throw new Error('No such file in this directory!')
        } catch (error) {
            console.log(error.message)
        }
    }
    
    readline.prompt();
};

export const copy = async ([src, dest], readline) => {

    if(!fs.existsSync(dest)){
        await fs.promises.mkdir(dest);
    }
    try{
        await fsPromises.copyFile(src, path.resolve(dest, path.basename(src)), 2);
    }catch {
        try {
            throw new Error('Error!')
        } catch (error) {
            console.log(error.message)
        }
    }
    
    if (readline) readline.prompt();
};

export const move = async ([src, dest], readline) => {
    copy([src, dest], false).then(async ()=>{
        fs.promises.rm(src)
        .then(readline.prompt());
    })
};

export const remove = async (currentPath, pathToFile, readline) => {
    fs.rm(path.resolve(currentPath, pathToFile), (error)=>{
        if (error){
            try {
                throw new Error('Error!')
            } catch (error) {
                console.log(error.message)
            }
        }
        readline.prompt();
    })
};