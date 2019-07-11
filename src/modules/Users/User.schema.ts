import { Schema, model } from 'mongoose'
import UserInterface from './User.interface'

const UserSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String
}, {
  timestamps: true
})

export default model<UserInterface>('User', UserSchema)
