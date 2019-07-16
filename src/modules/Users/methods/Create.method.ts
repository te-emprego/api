import { ModuleResponse } from '@services/ModuleRegister.service'
import UserInterface from '../User.interface'
import UserModel from '../User.schema'
import { validate, IsEmail, IsString, Min, Max, ValidationError, IsInt } from 'class-validator'

class InputValidation {
  @IsInt()
  @Min(3)
  @Max(255)
  @IsString()
  public name: string

  @IsEmail()
  public email: string

  @IsString()
  @Min(6)
  public password: string
}

class Method {
  private validation: InputValidation
  private returnData: UserInterface | ValidationError[]
  private returnStatus: number

  public constructor () {
    this.validation = new InputValidation()
  }

  public async run (user: UserInterface): Promise<ModuleResponse> {
    try {
      await this.validate(user)
      const storedUser = await this.store(user)

      return {
        status: 201,
        data: storedUser
      }
    } catch (error) {
      return {
        status: this.returnStatus,
        data: this.returnData
      }
    }
  }

  private async validate (data: UserInterface): Promise<void> {
    this.validation.name = data.name
    this.validation.email = data.email
    this.validation.password = data.password

    const errors = await validate(this.validation)

    if (errors.length) {
      this.returnStatus = 400
      this.returnData = errors
      throw new Error('Validation error')
    }
  }

  private async store (user: UserInterface): Promise<UserInterface | Error> {
    const newUser = new UserModel(user)

    return newUser
      .save()
      .then((user): UserInterface => user)
      .catch((error): Error => error.message)
  }
}

export default new Method()
