import { validateOrReject, IsString, IsEmail } from 'class-validator'

import { ModuleResponse, Credentials } from '@interfaces'
import { ControllerMethod } from '@classes'
import TokenService from '@services/Token.service'

import { User } from '../User.interface'
import UserModel from '../User.schema'

class InputValidation {
  @IsString()
  public password: string

  @IsEmail()
  public email: string
}

class Login extends ControllerMethod {
  private user: User
  private credentials: Credentials

  public handle = async (credentials: Credentials): Promise<ModuleResponse> => {
    this.credentials = credentials

    return this
      .validateInput()
      .then(this.findUser)
      .then(this.verifyPassword)
      .then(this.generateToken)
      .then(this.respond)
  }

  private validateInput = async (): Promise<void> => {
    try {
      const validation = new InputValidation()
      validation.email = this.credentials.email
      validation.password = this.credentials.password
      await validateOrReject(validation)
    } catch (error) {
      throw new this.HttpException(400, 'invalid inputs')
    }
  }

  private findUser = async (): Promise<void> => {
    const user = await UserModel.findOne({ email: this.credentials.email }).select('+password')

    if (!user) {
      throw new this.HttpException(400, 'user does\'t exists')
    }

    this.user = user
  }

  private verifyPassword = async (): Promise<void> => {
    const match = await this.Auth
      .comparePassword(this.credentials.password, this.user.password)

    if (!match) {
      throw new this.HttpException(400, 'invalid credentials')
    }
  }

  private generateToken = (): void => {
    const token = TokenService.encode(this.user)
    this.data = { token }
    this.status = 200
  }
}

export const login = new Login()
