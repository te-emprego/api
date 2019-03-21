const commands = process.argv.slice(2);
const make = require('./functions/make');

if (commands[0] === 'make:module') {
  make.module(commands[1]);
};