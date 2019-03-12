const router = require('express').Router();
const user = require('@controller/user');

router
  .post('/users/signin', user.signIn)
  .post('/users/signup', user.signUp);

module.exports = router;
