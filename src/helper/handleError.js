const logger = require('@service/logger');

const handleError = (res, status = 500, err, { message }) => {
  res
    .status(status)
    .send({ message: message || err.message || 'Internal server error' });

  logger.error({ error: err, message, status });
};

module.exports = handleError;
