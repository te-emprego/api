const path = require('path');

const resolve = p => path.resolve(__dirname, '..', '..', 'src', p);

module.exports = {
  controllers: resolve('controller'),
  models: resolve('model'),
};
