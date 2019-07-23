import ControllerMethod from '@classes/ControllerMethod.class'
import UserModel from '@modules/Users/User.schema'
import UserInterface from '@modules/Users/User.interface'
import { ModuleResponse } from '@interfaces'

class List extends ControllerMethod {
  private users: UserInterface[]

  public handle = async (): Promise<ModuleResponse> =>
    this
      .getUsers()
      .then(this.respond)

  private async getUsers (): Promise<void> {
    this.users = await UserModel.find()
    this.status = 200
    this.data = this.users
  }
}

export const list = new List()
