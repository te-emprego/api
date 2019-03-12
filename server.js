require('module-alias/register');
require('dotenv').config();

const mongoose = require('mongoose');
const normalize = require('normalize-port');
const config = require('./src/config');
const app = require('./src/app');

const mongooseConfig = {
  useNewUrlParser: true,
};

const port = normalize(config.port);

const boot = (err) => {
  if (err) {
    return console.log('Erro ao se conectar com o banco de dados.', err);
  }

  app.listen(port, (appError) => {
    console.log(
      appError
        ? ('Erro ao iniciar serviço.', appError)
        : `Serviço iniciado na porta ${port}`,
    );
  });
};

console.clear();
mongoose
  .connect(config.db.connectionString, mongooseConfig, boot);
