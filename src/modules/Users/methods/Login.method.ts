import ControllerMethod from '@classes/ControllerMethod.class'
import TokenService from '@services/Token.service'
import UserModel from '@modules/Users/User.schema'
import Credentials from '@interfaces/Credentials.interface'
import { ModuleResponse } from '@services/ModuleRegister.service'
import { compare } from 'bcrypt'

class Login extends ControllerMethod {
  public async handle (credentials: Credentials): Promise<ModuleResponse> {
    const { email, password } = credentials

    const user = await UserModel.findOne({ email })
    const passwordMatch = await compare(password, user.password)

    user.active = true
    await user.save()

    const loggedIn = user && passwordMatch

    return {
      status: loggedIn ? 201 : 400,
      data: loggedIn
        ? { token: TokenService.encode(user) }
        : { message: 'invalid credentials' }
    }
  }
}

export default new Login()
