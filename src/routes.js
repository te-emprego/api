const router = require('express').Router();
const user = require('@controller/user');
const profile = require('@controller/profile');
const whoAmI = require('@middleware/whoAmI');

router
  .get('/users/me', user.getUserByToken)
  .post('/users/signin', user.signIn)
  .post('/users/signup', user.signUp)
  .post('/users/forgot-password', user.forgotPassword)
  .post('/users/reset-password', user.resetPassword)
  .post('/users/has-permission', user.hasPermission)
  .put('/users/profile', user.setProfile)
  .patch('/users/me', whoAmI, user.updateProps);

router
  .post('/profiles', profile.create)
  .get('/profiles', profile.view);

module.exports = router;
