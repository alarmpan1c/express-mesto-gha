const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    minlength: 2,
    maxlength: 30,
    required: true,
    type: String,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    ref: 'user',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  createdAt: {
    default: Date.now,
    type: Date,
  },
});

module.exports = mongoose.model('card', cardSchema);
