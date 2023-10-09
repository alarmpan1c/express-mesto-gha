const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    minlength: 2,
    maxlength: 30,
    type: String,
    default: 'Жак-Ив Кусто',
  },
  about: {
    minlength: 2,
    maxlength: 30,
    type: String,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (link) => /(https?:\/\/)(www)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=])*#?$/.test(link),
      message: ({ value }) => `${value} Неверная ссылка на аватар`,
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: ({ value }) => `${value} Неверный Email`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('user', userSchema);
