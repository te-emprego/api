const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const read = tplName => handlebars.compile(fs.readFileSync(path.resolve(__dirname, `./${tplName}.hbs`), 'utf8'));

const env = read('.env');
const model = read('model');
const controller = read('controller');

module.exports = {
  env,
  model,
  controller,
};
