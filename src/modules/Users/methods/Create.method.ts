import { ModuleResponse } from '@interfaces'
import ControllerMethod from '@classes/ControllerMethod.class'
import UserInterface from '../User.interface'
import UserModel from '../User.schema'
import { validateOrReject, IsEmail, IsString, Length } from 'class-validator'

class InputValidation {
  @Length(3, 255)
  @IsString()
  public name: string

  @IsEmail()
  public email: string

  @IsString()
  @Length(6, 40)
  public password: string
}

class Method extends ControllerMethod {
  private validation: InputValidation
  private user: UserInterface
  private storedUser: UserInterface

  public constructor () {
    super()
    this.validation = new InputValidation()
  }

  public run = async (user: UserInterface): Promise<ModuleResponse> => {
    this.user = user

    return this
      .validateInput()
      .then(this.verifyIfUserExists)
      .then(this.storeUser)
      .then(this.respond)
  }

  private validateInput = async (): Promise<void> => {
    this.validation.name = this.user.name
    this.validation.email = this.user.email
    this.validation.password = this.user.password

    await validateOrReject(this.validation)
      .catch((errors): void => {
        throw new this
          .HttpException(this.status, 'input validation error', errors)
      })
  }

  private verifyIfUserExists = async (): Promise<void> => {
    return UserModel
      .findOne({ email: this.user.email })
      .then((user): void => {
        if (user) {
          throw new this.HttpException(400, 'user already exists')
        }
      })
  }

  private storeUser = async (): Promise<void> => {
    const newUser = new UserModel(this.user)
    const storedUser = await newUser.save()
    delete storedUser.password

    this.data = storedUser
  }
}

export default new Method()
