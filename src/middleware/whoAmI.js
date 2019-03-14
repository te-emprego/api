const { helpers } = require('@controller/user');
const error = require('@service/error');
/**
 * Adds user info in the request object
 * @param {object} req express request object
 * @param {object} res express response object
 */
const whoAmI = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return error({
      res,
      status: 400,
      payload: 'Token não providenciado.',
    });
  }

  try {
    const userId = await helpers.decodeToken(authorization);
    const user = await helpers.getUserInfo(userId);
    req.me = user;
    next();
  } catch (err) {
    error({
      res,
      status: err.status,
      payload: err.message,
      log: err,
    });
  }
};

module.exports = whoAmI;
