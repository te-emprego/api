import { Request, Response, NextFunction } from 'express'
import TokenService from '@services/Token.service'

class AuthenticationMiddleware {
  public handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { authorization } = req.headers

    const user = TokenService.decode(authorization)

    console.log(user)
    next()
  }
}

export default new AuthenticationMiddleware()
