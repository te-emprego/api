require('module-alias/register');
require('dotenv').config();

const mongoose = require('mongoose');
const normalize = require('normalize-port');
const figlet = require('figlet');
const chalk = require('chalk');
const config = require('./src/config');
const app = require('./src/app');

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

const port = normalize(config.port);

const ascii = chalk.cyan(figlet.textSync('TE EMPREGO'));
const info = chalk.yellow('api@beta\t\t\t\t  @danielbonifacio');

const boot = (err) => {
  if (err) {
    return console.log('Erro ao se conectar com o banco de dados.', err);
  }

  app.listen(port, (appError) => {
    console.log(
      appError
        ? ('Erro ao iniciar serviço.', appError)
        : `${ascii}\n${info}`,
    );
  });
};

console.clear();
mongoose
  .connect(config.db.connectionString, boot);
