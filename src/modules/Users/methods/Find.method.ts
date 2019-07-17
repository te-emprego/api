import ControllerMethod from '@classes/ControllerMethod.class'
import UserModel from '@modules/Users/User.schema'
import UserInterface from '@modules/Users/User.interface'
import { ModuleResponse } from '@interfaces'

class Find extends ControllerMethod {
  public handle = async (userId: string): Promise<ModuleResponse> => {
    const users = await this.getUser(userId)
    return {
      status: 200,
      data: users
    }
  }

  private async getUser (userId: string): Promise<UserInterface> {
    const user = await UserModel.findOne({ _id: userId })
    return user
  }
}

export default new Find()
