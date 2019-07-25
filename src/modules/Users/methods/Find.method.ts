import { ModuleResponse } from '@interfaces'
import { ControllerMethod } from '@classes'

import UserModel from '../User.schema'
import { User } from '../User.interface'

class Find extends ControllerMethod {
  private userId: string

  public handle = async (userId: string): Promise<ModuleResponse> => {
    this.userId = userId

    return this
      .getUser()
      .then(this.respond)
  }

  private getUser = async (): Promise<void> => {
    const { userId } = this

    const user: User =
    await UserModel
      .findOne({ _id: userId })
      .catch((): any => {
        throw new this.HttpException(400, 'user not found')
      })

    this.status = 200
    this.data = user
  }
}

export const find = new Find()
