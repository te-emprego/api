import { Strategy } from 'passport-google-oauth20'
import config from '@config'

const { id, secret } = config.passport.google.client

const googleStrategy = new Strategy(
  {
    clientID: id,
    clientSecret: secret,
    callbackURL: 'users/auth/google/callback'
  },
  function (token, secret, profile, done): void {
    console.log('reached')
    console.log(token, secret)
    return done()
  }
)

export default googleStrategy
