import { Document } from 'mongoose'

interface Address {
  country?: string
  city?: string
  state?: string
}

interface PasswordReset {
  token: string
  expiration: string
}

export default interface UserInterface extends Document {
  name: string
  email: string
  password: string
  emailConfirm?: string
  phone?: string
  avatar?: string
  birthdate?: Date
  lastLogin?: Date
  address?: Address
  passwordReset?: PasswordReset
}
