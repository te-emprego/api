const mongoose = require('mongoose');

const { Schema } = mongoose;

const JobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  salary: {
    type: Number,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'category',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('job', JobSchema);
