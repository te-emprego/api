const handlebars = require('handlebars');
const templates = require('../templates');
const paths = require('../functions/paths');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');

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
  }
}

module.exports = make;
