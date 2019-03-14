const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('@config');

const create = (user) => {
  const payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(5, 'hours').unix(),
  };

  return jwt.encode(payload, config.secret);
};

const decode = token => new Promise((resolve, reject) => {
  try {
    const payload = jwt.decode(token, config.secret);

    if (payload.exp <= moment.unix()) {
      reject({
        status: 401,
        message: 'Token expirado.',
      });
    }

    resolve(payload.sub);
  } catch (err) {
    reject({
      status: 400,
      message: 'Token inválido.',
    });
  }
});

module.exports = {
  create,
  decode,
};
