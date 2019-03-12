const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  permissions: {
    type: Array,
  },
  users: {
    select: false,
    unique: true,
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'user',
    }],
  },
});

module.exports = mongoose.model('profile', UserSchema);
