const handlebars = require('handlebars');
const templates = require('../templates');
const paths = require('../functions/paths');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const chalk = require('chalk');

const make = {
  maker(type, name) {
    const data = {
      Model: _.upperFirst(name),
      model: _.camelCase(name),
    };
    const tpl = templates[type](data);
    const p = paths[type + 's'];

    try {
      fs.writeFileSync(path.resolve(p, data.model + '.js'), tpl)
    } catch (err) {
      console.log(`Erro ao criar o model ${name}.`, err);
    }
  },
  
  module(name) {
    this.maker('model', name);
    this.maker('controller', name);
  },

  env() {
    console.log('Gerando arquivo com variáveis de ambiente...');

    const p = paths.root;
    const tpl = templates.env();

    const exists = fs.existsSync(path.resolve(p, '.env'));
    
    if (exists) {
      const error = chalk.yellow('O Arquivo .env já existe.');
      return console.log(error);
    }


    try {
      fs.writeFileSync(path.resolve(p, '.env'), tpl);
      const success = chalk.green('Arquivo .env gerado com sucesso.');
      console.log(success);
    } catch (err) {
      console.log(`Erro ao criar o model ${name}.`, err);
    }

  },
}

module.exports = make;
