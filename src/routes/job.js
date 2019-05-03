const router = require('express').Router();
const job = require('@controller/job');
const whoAmI = require('@middleware/whoAmI');
const allowedOnly = require('@middleware/allowedOnly');

router
  .post('/jobs', whoAmI, allowedOnly('admin'), job.create)
  .get('/jobs', whoAmI, job.read);

module.exports = router;
