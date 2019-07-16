import { ModuleResponse } from '@services/ModuleRegister.service'
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

class Method {
  private validation: InputValidation
  private returnData: any
  private returnStatus: number

  public constructor () {
    this.validation = new InputValidation()
  }

  public run = async (user: UserInterface): Promise<ModuleResponse> => {
    try {
      this
        .runValidation(user)
        .catch((): Promise<UserInterface> => this.store(user))
      const storedUser = await this.store(user)

      return {
        status: 201,
        data: storedUser
      }
    } catch (error) {
      return {
        status: this.returnStatus || 500,
        data: this.returnData || { message: error.message }
      }
    }
  }

  private async runValidation (data: UserInterface): Promise<void> {
    this.validation.name = data.name
    this.validation.email = data.email
    this.validation.password = data.password

    await validateOrReject(this.validation)
      .catch((errors): void => {
        this.returnStatus = 400
        this.returnData = { message: 'validatio error', errors }
        throw new Error('Validation error')
      })
  }

  private async store (user: UserInterface): Promise<UserInterface> {
    const newUser = new UserModel(user)

    try {
      const storedUser = await newUser.save()
      delete storedUser.password
      return storedUser
    } catch (error) {
      this.returnStatus = 500
      throw new Error(error.message)
    }
  }
}

export default new Method()
