import ControllerMethod from '@classes/ControllerMethod.class'
import TokenService from '@services/Token.service'
import UserModel from '@modules/Users/User.schema'
import { ModuleResponse, Credentials } from '@interfaces'
import { compare } from 'bcrypt'
import { validateOrReject, IsString, IsEmail } from 'class-validator'
import UserInterface from '../User.interface'
import HttpException from '@classes/HttpException.class'

class InputValidation {
  @IsString()
  public password: string

  @IsEmail()
  public email: string
}

class Login extends ControllerMethod {
  private user: UserInterface
  private credentials: Credentials

  public handle = async (credentials: Credentials): Promise<ModuleResponse> => {
    this.credentials = credentials

    return this
      .findUser()
      .then(this.verifyPassword)
      .then(this.generateToken)
      .then(this.respond)
  }

  private verifyPassword = async (): Promise<void> => {
    const match = this.Auth.comparePassword(this.credentials.password, this.user.password)
    if (!match) {
      throw new this.HttpException(400, 'invalid credentials')
    }
  }

  private findUser = async (): Promise<void> => {
    const user = await UserModel.findOne({ email: this.credentials.email })

    if (!user) {
      throw new this.HttpException(400, 'user does\'t exists')
    }

    this.user = user
  }

  private generateToken = (): void => {
    const token = TokenService.encode(this.user)
    this.data = { token }
  }
}

export default new Login()
