import { Document } from 'mongoose'

export interface Address {
  country?: string
  city?: string
  state?: string
}

export interface PasswordReset {
  token: string
  expiration: string
}

export interface User extends Document {
  active: boolean
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
  createdAt: Date
  updatedAt: Date
}
