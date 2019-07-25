import { Schema, model, HookNextFunction } from 'mongoose'
import { User } from './User.interface'
import bcrypt from 'bcrypt'

export const AddressSchema = new Schema({
  country: {
    type: String
  },
  state: {
    type: String
  },
  city: {
    type: String
  }
})

export const PasswordResetSchema = new Schema({
  token: String,
  expiration: String
})

const UserSchema = new Schema({
  active: {
    default: true,
    type: Boolean
  },
  email: {
    required: true,
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    required: true,
    type: String
  },
  phone: {
    type: String
  },
  avatar: {
    type: String
  },
  birthdate: {
    type: Date
  },
  address: {
    type: AddressSchema
  },
  lastLogin: {
    type: Date
  },
  emailConfirm: {
    type: String,
    select: false
  },
  passwordReset: {
    type: PasswordResetSchema,
    select: false
  }
}, {
  timestamps: true
})

UserSchema.pre<User>('save', async function (next: Function): Promise<HookNextFunction> {
  if (this.password) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
  }
  return next()
})

export default model<User>('User', UserSchema)
