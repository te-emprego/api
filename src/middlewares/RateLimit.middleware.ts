import RateLimit from 'express-rate-limit'
import config from '@config'

const limiter = new RateLimit({
  windowMs: config.requests.window,
  max: config.requests.limit
})

export default limiter
