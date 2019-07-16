import { encode, decode } from 'jwt-simple'
import config from '@config'

class TokenService {
  private secret: string
  private jwtEncode: Function
  private jwtDecode: Function

  public constructor () {
    this.secret = config.app.secret
    this.jwtEncode = encode
    this.jwtDecode = decode
  }

  public encode (userObject: object): string {
    return this.jwtEncode(userObject, this.secret)
  }

  public decode (token: string): object {
    return this.jwtDecode(token, this.secret)
  }
}

export default new TokenService()
