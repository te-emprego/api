/* eslint-disable object-curly-newline */
/**
 * Error handler
 * @param {object} res express response object
 * @param {number} status response status number
 * @param {string|object} payload response error payload
 * @param {Error} log error object to log
 */

const error = ({ res, status, payload, log }) => {
  let response = {};
  /(undefined|string)/.test(typeof payload)
    ? response.message = payload || 'Erro interno do servidor.'
    : response = payload;

  (log && console.log(log));

  return res
    .status(status || 500)
    .send(response);
};

module.exports = error;
