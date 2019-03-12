const router = require('express').Router();
const user = require('@controller/user');
const profile = require('@controller/profile');

router
  .post('/users/signin', user.signIn)
  .post('/users/signup', user.signUp)
  .post('/users/forgot-password', user.forgotPassword)
  .post('/users/reset-password', user.resetPassword);

router
  .post('/profiles', profile.create)
  .get('/profiles', profile.view);

module.exports = router;
