const router = require('express').Router();
const user = require('@controller/user');
const profile = require('@controller/profile');
const category = require('@controller/category');
const job = require('@controller/job');
const whoAmI = require('@middleware/whoAmI');
const allowedOnly = require('@middleware/allowedOnly');
const multiparty = require('connect-multiparty')({
  uploadDir: 'temp',
});

router
  .get('/users/me', user.getUserByToken)
  .post('/users/signin', user.signIn)
  .post('/users/signup', user.signUp)
  .post('/users/forgot-password', user.forgotPassword)
  .post('/users/reset-password', user.resetPassword)
  .post('/users/me/avatar', whoAmI, multiparty, user.uploadProfilePicture)
  .post('/users/has-permission', whoAmI, allowedOnly('users/read'), user.hasPermission)
  .put('/users/profile', whoAmI, allowedOnly('users/update'), user.setProfile)
  .patch('/users/me', whoAmI, allowedOnly('users/update'), user.updateProps)
  .post('/users/me/email', whoAmI, allowedOnly('users/update'), user.requestEmailUpdate);

// public email confirmation urls
router
  .get('/confirm-account', user.confirmEmail)
  .get('/confirm-new-email', user.confirmEmailUpdate);

router
  .post('/profiles', whoAmI, allowedOnly('admin'), profile.create)
  .get('/profiles', whoAmI, profile.view);

router
  .post('/categories', whoAmI, allowedOnly('admin'), category.create)
  .get('/categories', whoAmI, category.read);

router
  .post('/jobs', whoAmI, allowedOnly('admin'), job.create)
  .get('/jobs', whoAmI, job.read);

module.exports = router;
