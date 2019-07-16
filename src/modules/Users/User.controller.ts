import UserSchema from './User.schema'
import { ModuleResponse } from '@services/ModuleRegister.service'
import { create } from './methods'

class UserController {
  public create: any

  public constructor () {
    this.create = create.run
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
