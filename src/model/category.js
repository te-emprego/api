const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  jobs: {
    select: false,
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'job',
    }],
  },
});

module.exports = mongoose.model('category', CategorySchema);
