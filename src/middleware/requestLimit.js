const config = require('@config');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

const limiter = rateLimit({
  windowMs: config.requests.windowMs,
  max: config.requests.rateLimitRequests,
});

const darlingStandByMe = slowDown({
  windowMs: config.requests.windowMs,
  delayAfter: config.requests.slowDownMaxRequests,
  delayMs: config.requests.slowDownDelay,
});

module.exports = [
  limiter,
  darlingStandByMe,
];
