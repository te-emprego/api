import UserSchema from './User.schema'
import { ModuleResponse } from '@services/ModuleRegister.service'
import { create, login } from './methods'

class UserController {
  public create: any
  public login: any

  public constructor () {
    this.create = create.run
    this.login = login.handle
  }

  public async index (): Promise<ModuleResponse> {
    const users = await UserSchema.find()
    return {
      status: 200,
      data: users
    }
  }

  public async auth (): Promise<ModuleResponse> {
    return {
      status: 200,
      data: {
        message: 'google callback function'
      }
    }
  }
}

export default new UserController()
