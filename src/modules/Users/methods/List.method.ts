import ControllerMethod from '@classes/ControllerMethod.class'
import UserModel from '@modules/Users/User.schema'
import UserInterface from '@modules/Users/User.interface'
import { ModuleResponse } from '@services/ModuleRegister.service'

class List extends ControllerMethod {
  public handle = async (): Promise<ModuleResponse> => {
    const users = await this.getUsers()
    return {
      status: 200,
      data: users
    }
  }

  private async getUsers (): Promise<UserInterface[]> {
    const users = await UserModel.find()
    return users
  }
}

export default new List()
