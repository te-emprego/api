const router = require('express').Router();
const user = require('@controller/user');
const profile = require('@controller/profile');
const whoAmI = require('@middleware/whoAmI');
const allowedOnly = require('@middleware/allowedOnly');

router
  .get('/users/me', user.getUserByToken)
  .post('/users/signin', user.signIn)
  .post('/users/signup', user.signUp)
  .post('/users/forgot-password', user.forgotPassword)
  .post('/users/reset-password', user.resetPassword)
  .post('/users/has-permission', whoAmI, allowedOnly('users/read'), user.hasPermission)
  .put('/users/profile', whoAmI, allowedOnly('users/update'), user.setProfile)
  .patch('/users/me', whoAmI, allowedOnly('users/update'), user.updateProps);

router
  .post('/profiles', whoAmI, allowedOnly('admin'), profile.create)
  .get('/profiles', whoAmI, profile.view);

module.exports = router;
