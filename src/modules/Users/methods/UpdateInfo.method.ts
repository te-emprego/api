import ControllerMethod from '@classes/ControllerMethod.class'
import UserModel from '@modules/Users/User.schema'
import UserInterface, { Address } from '@modules/Users/User.interface'
import { ModuleResponse } from '@interfaces'
import { IsString, Length, validateOrReject, IsDate, ValidateNested } from 'class-validator'

class InputValidation {
  @IsString()
  @Length(3, 255)
  public name: string

  @Length(9, 11)
  public phone: string

  @Length(0, 350)
  public avatar: string

  @IsDate()
  public birthdate: Date

  @ValidateNested()
  public address: Address
}

interface SanitizedProps {
  name?: string
  phone?: string
  birthdate?: Date
  address?: Address
}

class UpdateInfo extends ControllerMethod {
  private userId: string
  private newProps: UserInterface
  private user: UserInterface
  private sanitizedProps: SanitizedProps

  public handle = async (userId: string, newProps: UserInterface): Promise<ModuleResponse> => {
    this.userId = userId
    this.newProps = newProps

    return this
      .validateInput()
      .then(this.checkIfUserExists)
      .then(this.sanitizeProps)
      .then(this.updateUserProps)
      .then(this.respond)
  }

  private validateInput = async (): Promise<void> => {
    try {
      const validation = new InputValidation()

      validation.name = this.newProps.name
      validation.phone = this.newProps.phone
      validation.address = this.newProps.address
      validation.avatar = this.newProps.avatar
      validation.birthdate = this.newProps.birthdate

      await validateOrReject(validation)
    } catch (error) {
      throw new this.HttpException(400, 'invalid inputs', error)
    }
  }

  private async checkIfUserExists (): Promise<void> {
    const user: UserInterface =
    await UserModel
      .findOne({ _id: this.userId })
      .catch((): UserInterface => {
        throw new this.HttpException(400, 'user does not existis')
      })

    this.user = user
  }

  private sanitizeProps (): void {
    const sanitized = { ...this.user }

    // Sensitive data
    delete sanitized.email
    delete sanitized.active
    delete sanitized.emailConfirm
    delete sanitized.password
    delete sanitized.passwordReset
    delete sanitized.lastLogin
    delete sanitized.createdAt
    delete sanitized.updatedAt

    this.sanitizedProps = sanitized
  }

  private async updateUserProps (): Promise<void> {
    const newUser = await UserModel
      .findOneAndUpdate(
        { _id: this.userId },
        { $set: { ...this.sanitizedProps } },
        { new: true }
      )

    this.status = 200
    this.data = newUser
  }
}

export const updateInfo = new UpdateInfo()
