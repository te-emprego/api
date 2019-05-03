const router = require('express').Router();
const category = require('@controller/category');
const whoAmI = require('@middleware/whoAmI');
const allowedOnly = require('@middleware/allowedOnly');

router
  .post('/categories', whoAmI, allowedOnly('admin'), category.create)
  .get('/categories', whoAmI, category.read);

module.exports = router;
