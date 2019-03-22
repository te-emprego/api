const commands = process.argv.slice(2);
const make = require('./functions/make');

switch (commands[0]) {
  case 'make:module':
    make.module(commands[1]);
    break;
  
  case 'make:controller': 
    make.maker('controller', commands[1]);
    break;

  case 'make:model':
    make.maker('model', commands[1]);
    break;

  case 'generate:env':
    make.env();
    break;
}
