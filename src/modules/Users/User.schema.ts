import { Schema, model } from 'mongoose'
import UserInterface from './User.interface'

const UserSchema = new Schema({
  email: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String
  }
}, {
  timestamps: true
})

export default model<UserInterface>('User', UserSchema)
