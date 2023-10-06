const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    minlength: 2,
    maxlength: 30,
    required: true,
    type: String,
  },
  about: {
    minlength: 2,
    maxlength: 30,
    required: true,
    type: String,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
