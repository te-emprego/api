const mongoose = require('mongoose');
const week = require('@model/week');

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
  genre: {
    type: String,
    enum: ['Freelance', 'CLT', 'PJ', 'Estágio', 'A combinar'],
  },
  requiresExperience: {
    type: Boolean,
    default: false,
  },
  hoursPerWeek: {
    type: Number,
  },
  daysOfWeek: [{
    type: String,
    enum: week,
  }],
  remote: {
    type: Boolean,
  },
  publicContact: {
    type: Boolean,
  },
  published: {
    type: Boolean,
  },
  startsIn: {
    type: String,
  },
  required: {
    type: String,
  },
  desirable: {
    type: String,
  },
  requiresHigherEducation: {
    type: Boolean,
    default: false,
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
