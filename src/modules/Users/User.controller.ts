import UserSchema from './User.schema'
import UserInterface from './User.interface'
import { ModuleResponse } from '@services/ModuleRegister.service'
class UserController {
  public async index (): Promise<ModuleResponse> {
    const users = await UserSchema.find()
    return {
      status: 200,
      data: users
    }
  }

  public async create (user: UserInterface): Promise<ModuleResponse> {
    const createdUser = await UserSchema.create(user)
    console.log(createdUser)
    return {
      status: 201,
      data: createdUser
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
