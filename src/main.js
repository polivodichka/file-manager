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
  import * as basic from './basicOperations.js'
  import * as nwd from './nwd.js'
  import * as operating from './operatingSystem.js'
  import crypto from 'crypto';

  const main = () => {
      const USER = process.argv[process.argv.indexOf('--user-name') + 1];
      let currentDirectory = operating.getHomeDir();

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

              case 'cat':
                  await basic.read(currentDirectory, comandContent, rl);
                  break;

              case 'add':
                  await basic.create(currentDirectory, comandContent, rl);
                  break;

              case 'rn':
                  await basic.rename(
                      currentDirectory,
                      comandContent,
                      rl
                  );
                  break;

              case 'cp':
                  await basic.copy(
                      splitPaths(currentDirectory, comandContent),
                      rl
                  );
                  break;

              case 'mv':
                  await basic.move(
                      splitPaths(currentDirectory, comandContent),
                      rl
                  );
                  break;

              case 'rm':
                  await basic.remove(currentDirectory, comandContent, rl);
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
                          console.log('Invalid input');
                          rl.prompt();
                          break;

                  }
                  rl.prompt();
                  break;
              case 'hash':
                  fs.readFile(path.resolve(currentDirectory, comandContent), (error, fileBuffer) => {
                      if (error) {
                          console.log('Invalid input');
                      } else {
                          console.log(crypto.createHash('sha256').update(fileBuffer).digest('hex'));
                      }
                      rl.prompt();
                  });
                  break;
              case '.exit':
                  process.exit(1);
              default:
                  console.log('Invalid input');
                  rl.prompt();
                  break;
          }
      });

      process.on('exit', (code) => {
          console.log(`${code === 0 ? '\n' : ''}Thank you for using File Manager, ${USER}!`);
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