import passport from 'passport'
import GoogleStrategy from '@services/strategies/Google.strategy'

class AuthenticationService {
  private passport: passport.PassportStatic

  public constructor () {
    this.passport = passport
    this.passport.use(GoogleStrategy)
  }

  public google = (options: passport.AuthenticateOptions): any => {
    return this.passport.authenticate('google', { ...options })
  }
}

export default new AuthenticationService()
