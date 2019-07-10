import User from './User.schema'
import { Request, Response } from 'express'
import ErrorService from '@services/Error.service'

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    const users = await User.find()
    ErrorService.log('vaksjasdha')
    return res.json(users)
  }

  public async create (req: Request, res: Response): Promise<Response> {
    const user = await User.create(req.body)
    return res.json(user)
  }
}

export default new UserController()
