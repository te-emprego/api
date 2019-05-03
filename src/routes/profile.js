const router = require('express').Router();
const profile = require('@controller/profile');
const whoAmI = require('@middleware/whoAmI');
const allowedOnly = require('@middleware/allowedOnly');

router
  .post('/profiles', whoAmI, allowedOnly('admin'), profile.create)
  .get('/profiles', whoAmI, profile.view);

module.exports = router;
