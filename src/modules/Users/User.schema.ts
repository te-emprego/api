import { Schema, model, HookNextFunction } from 'mongoose'
import UserInterface from './User.interface'
import bcrypt from 'bcrypt'

const AddressSchema = new Schema({
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country'
  },
  state: {
    type: Schema.Types.ObjectId,
    ref: 'State'
  },
  city: {
    type: Schema.Types.ObjectId,
    ref: 'City'
  }
})

const PasswordResetSchema = new Schema({
  token: String,
  expiration: String
})

const UserSchema = new Schema({
  email: {
    required: true,
    type: String,
    unique: true
  },
  emailConfirm: {
    type: String,
    select: false
  },
  name: {
    required: true,
    type: String
  },
  phone: {
    type: String,
    unique: true,
    required: true
  },
  avatar: {
    type: String
  },
  birthdate: {
    type: Date,
    required: true
  },
  address: {
    type: AddressSchema
  },
  lastLogin: {
    type: Date
  },
  password: {
    type: String,
    required: true
  },
  passwordReset: {
    type: PasswordResetSchema,
    select: false
  }
}, {
  timestamps: true
})

UserSchema.pre<UserInterface>('save', async function (next): Promise<HookNextFunction> {
  if (this.password) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
  }
  return next()
})

export default model<UserInterface>('User', UserSchema)
