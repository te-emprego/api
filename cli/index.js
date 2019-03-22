const commands = process.argv.slice(2);
const make = require('./functions/make');

const [command, name] = commands;

switch (command) {
  case 'make:module':
    make.module(name);
    break;

  case 'make:controller':
    make.maker('controller', name);
    break;

  case 'make:model':
    make.maker('model', name);
    break;

  case 'generate:env':
    make.env();
    break;

  default:
    console.log('Comando inexistente.');
    break;
}
