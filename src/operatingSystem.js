import os from 'os';

export const getOsInfo = function(){
    return JSON.stringify(os.EOL);
}

export const getCpus = function(){
    return os.cpus();
}

export const getHomeDir = function(){
    return String(os.homedir);
}

export const getUserName = function(){
    return os.userInfo().username;
}

export const getArchitecture = function(){
    return os.arch();
}