/* eslint-disable global-require */
const path = require('path');
const router = require('express').Router();

const normalizedPath = path.join(__dirname, 'routes');

require('fs').readdirSync(normalizedPath).forEach((file) => {
  router.use('/', require(`./routes/${file}`));
});

module.exports = router;
