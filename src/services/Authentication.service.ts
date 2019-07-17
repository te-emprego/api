import passport from 'passport'
import GoogleStrategy from '@services/strategies/Google.strategy'
import { compare } from 'bcrypt'

class AuthenticationService {
  private passport: passport.PassportStatic
  private bcryptCompare: Function

  public constructor () {
    this.passport = passport
    this.passport.use(GoogleStrategy)
    this.bcryptCompare = compare
  }

  public google = (options: passport.AuthenticateOptions): any =>
    this.passport.authenticate('google', { ...options })

  public comparePassword = (pass: string, hash: string): boolean => {
    try {
      return !!this.bcryptCompare(pass, hash)
    } catch (err) {
      // if pass or hash is nullable, bcrypt throws an error
      return false
    }
  }
}

export default AuthenticationService
