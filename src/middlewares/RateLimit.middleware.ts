import RateLimit from 'express-rate-limit'
import config from '@config'

const limiter = new RateLimit({
  windowMs: config.requests.window,
  max: config.requests.limit
})

export const loginLimiter = new RateLimit({
  windowMs: 2 * 60 * 1000,
  max: 10
})

export default limiter
