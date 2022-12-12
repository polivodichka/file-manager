import { stdin as input, stdout as output } from 'process';
import * as readline from 'readline';
import path from 'path';

import * as nwd from './nwd.js';
import * as basic from './basicOperations.js';
import * as operating from './operatingSystem.js';
import { getHash } from './hash.js';
import { compress, decompress } from './zip.js';
import { splitCommand, splitPaths } from './utilityFunctions.js';
import { throwInvalidInput } from './errors.js';

const rl = readline.createInterface({
    input,
    output
});

const main = () => {
    const USER = process.argv
        .find(arg => arg.match(/--username\w*/)).split('=')[1] ?? null;
    let currentDirectory = operating.getHomeDir();

    if (!USER) {
        console.log(process.argv);
        console.log("'--username' shuld be exist");
        process.exit(0);
    } else console.log(`\x1b[35mWelcome to the File Manager, ${USER}!\n\x1b[0m`);

    rl.setPrompt(`\x1b[36mYou are currently in ${currentDirectory} >\n\x1b[0m`);
    rl.prompt();
    rl.on('line', async (line) => {
        let [comandName, comandContent] = splitCommand(line);
        switch (comandName) {
            case 'up':
                currentDirectory = nwd.up(currentDirectory);
                rl.setPrompt(`\x1b[36mYou are currently in ${currentDirectory} >\n\x1b[0m`);
                rl.prompt();
                break;

            case 'cd':
                currentDirectory = nwd.cd(currentDirectory, comandContent);
                rl.setPrompt(`\x1b[36mYou are currently in ${currentDirectory} >\n\x1b[0m`);
                rl.prompt();
                break;

            case 'ls':
                nwd.list(currentDirectory)
                    .then(list => {
                        list = list.map(elem => { return { Name: elem.isFile() ? path.parse(elem.name).name : elem.name, Type: elem.isFile() ? 'file' : 'directory' } })
                        console.table(list);
                        rl.prompt();
                    })
                break;

            case 'cat':
                await basic.read(currentDirectory, comandContent, rl);
                break;

            case 'add':
                await basic.create(currentDirectory, comandContent, rl);
                break;

            case 'rn':
                await basic.rename(splitPaths(currentDirectory, comandContent), rl);
                break;

            case 'cp':
                await basic.copy(splitPaths(currentDirectory, comandContent), rl);
                break;

            case 'mv':
                await basic.move(splitPaths(currentDirectory, comandContent), rl);
                break;

            case 'rm':
                await basic.remove(path.resolve(currentDirectory, comandContent), rl);
                break;

            case 'os':
                switch (comandContent) {
                    case '--EOL':
                        console.log(operating.getOsInfo());
                        break;
                    case '--cpus':
                        console.log(operating.getCpus());
                        break;
                    case '--homedir':
                        console.log(operating.getHomeDir());
                        break;
                    case '--username':
                        console.log(operating.getUserName());
                        break;
                    case '--architecture':
                        console.log(operating.getArchitecture());
                        break;
                    default:
                        throwInvalidInput();
                        rl.prompt();
                        break;
                }
                rl.prompt();
                break;
            case 'hash':
                getHash(currentDirectory, comandContent, rl);
                break;
            case 'compress':
                compress(splitPaths(currentDirectory, comandContent));
                rl.prompt();
                break;
            case 'decompress':
                decompress(splitPaths(currentDirectory, comandContent));
                rl.prompt();
                break;
            case '.exit':
                process.exit();
            default:
                throwInvalidInput();
                rl.prompt();
                break;
        }
    });

    process.on('exit', (code) => {
        console.log(`\x1b[35m\nThank you for using File Manager, ${USER}!\n\x1b[0m`);
    });

};

main();