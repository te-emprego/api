const router = require('express').Router();
const user = require('@controller/user');

router
  .post('/users/signin', user.signIn)
  .post('/users/signup', user.signUp)
  .post('/users/forgot-password', user.forgotPassword)
  .post('/users/reset-password', user.resetPassword);

module.exports = router;
