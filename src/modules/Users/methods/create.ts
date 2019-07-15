import { ModuleResponse } from '@services/ModuleRegister.service'
import UserInterface from '../User.interface'
import UserModel from '../User.schema'
import { validate, IsEmail, IsString, Min, Max } from 'class-validator'

class BaseUser {
  @Min(3)
  @Max(255)
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  @Min(6)
  password: string
}

export default async (user: UserInterface): Promise<ModuleResponse> => {
  const userValidation = new BaseUser(user)
  return {
    status: 200,
    data: user
  }
}
