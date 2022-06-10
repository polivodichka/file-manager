  import fs from 'fs';
  import path from 'path';
  import * as readline from 'readline';
  import {
      stdin as input,
      stdout as output
  } from 'process';
  const rl = readline.createInterface({
      input,
      output
  });
  import os from 'os';
  import * as basic from './basicOperations.js'
  import * as nwd from './nwd.js'

  const main = () => {
      const USER = process.argv[process.argv.indexOf('--user-name') + 1];
      let currentDirectory = String(os.homedir);

      if (!process.argv.includes('--user-name')) {
          console.log("'--user-name' shuld be exist");
          process.exit(0);
      } else console.log(`Welcome to the File Manager, ${USER}!`);

      rl.setPrompt(`You are currently in ${currentDirectory} >\n`);
      rl.prompt();
      rl.on('line', async (line) => {
          let [comandName, comandContent] = splitCommand(line);
          switch (comandName) {
              case 'up':
                  currentDirectory = nwd.up(currentDirectory);
                  rl.setPrompt(`You are currently in ${currentDirectory} >\n`);
                  rl.prompt();
                  break;

              case 'cd':
                  currentDirectory = nwd.cd(currentDirectory, comandContent);
                  rl.setPrompt(`You are currently in ${currentDirectory} >\n`);
                  rl.prompt();
                  break;

              case 'ls':
                  nwd.list(currentDirectory, rl)
                      .then(list => {
                          console.log(list.join('\n'));
                          rl.prompt();
                      })
                  break;

              default:
                  await console.log('Invalid input');
                  rl.prompt();
                  break;
          }
      });

      process.on('exit', (code) => {
          console.log(`${code === 0 ? '\n' : ''}Great! See you later :)`);
      });

  };

  function splitCommand(commandLine) {
      let splitted = commandLine.split(/ +/);
      let commandName = splitted[0];
      splitted.shift();
      return [commandName, splitted.join(' ')];
  }

  function splitPaths(currentPath, paths) {
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

  main();