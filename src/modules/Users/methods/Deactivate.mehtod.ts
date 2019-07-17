import ControllerMethod from '@classes/ControllerMethod.class'
import UserModel from '@modules/Users/User.schema'
import { ModuleResponse } from '@services/ModuleRegister.service'

class Deactivate extends ControllerMethod {
  public handle = async (userId: string): Promise<ModuleResponse> => {
    const userExists = await this.checkIfUserExists(userId)
    userExists && await this.deactivateUser(userId)
    return {
      status: userExists ? 200 : 400,
      data: userExists
        ? { message: 'user successfully deactivated' }
        : { message: 'invalid user id' }
    }
  }

  private async checkIfUserExists (userId: string): Promise<boolean> {
    const exists = await UserModel.findOne({ _id: userId })
    return !!exists
  }

  private async deactivateUser (userId: string): Promise<boolean> {
    const success = await UserModel
      .findOneAndUpdate(
        { _id: userId },
        { $set: { active: false } }
      )
    return !!success
  }
}

export default new Deactivate()
