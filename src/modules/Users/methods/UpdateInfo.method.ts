import ControllerMethod from '@classes/ControllerMethod.class'
import UserModel from '@modules/Users/User.schema'
import UserInterface from '@modules/Users/User.interface'
import { ModuleResponse } from '@interfaces'

class UpdateInfo extends ControllerMethod {
  public handle = async (userId: string, newProps: UserInterface): Promise<ModuleResponse> => {
    const userExists = await this.checkIfUserExists(userId)
    const sanitizedProps = this.sanitizeProps(newProps)
    const data = userExists && await this.updateUserProps(userId, sanitizedProps)
    return {
      status: userExists ? 200 : 400,
      data: userExists ? data : { message: 'invalid user id' }
    }
  }

  private async checkIfUserExists (userId: string): Promise<boolean> {
    const exists = await UserModel.findOne({ _id: userId })
    return !!exists
  }

  // TODO: create sanitized props Interface
  private sanitizeProps (props: UserInterface): any {
    const sanitized = { ...props }

    // Sensitive data
    delete sanitized.email
    delete sanitized.active
    delete sanitized.emailConfirm
    delete sanitized.password
    delete sanitized.passwordReset
    delete sanitized.lastLogin
    delete sanitized.createdAt
    delete sanitized.updatedAt

    return sanitized
  }

  private async updateUserProps (userId: string, newProps: UserInterface): Promise<UserInterface> {
    const users = await UserModel
      .findOneAndUpdate(
        { _id: userId },
        { $set: { ...newProps } },
        { new: true }
      )
    return users
  }
}

export default new UpdateInfo()
