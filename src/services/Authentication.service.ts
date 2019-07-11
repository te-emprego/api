import passport, { PassportStatic } from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import config from '@config'
import { Application } from 'express'

class AuthenticationService {
  private passport: PassportStatic

  public constructor () {
    this.passport = passport
    this.injectGoogleStrategy()
  }

  private injectGoogleStrategy (): void {
    this.passport.use(new GoogleStrategy.Strategy({
      clientID: config.passport.google.client.id,
      clientSecret: config.passport.google.client.secret,
      callbackURL: 'users/auth/google/callback'
    }, this.googleStrategy))
  }

  private googleStrategy (token, secret, profile, done): void {
    console.log('reached')
    console.log(token, secret)
    return done()
  }

  public google = (options: passport.AuthenticateOptions): Application => {
    return this.passport.authenticate('google', { ...options })
  }
}

export default new AuthenticationService()
