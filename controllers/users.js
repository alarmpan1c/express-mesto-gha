const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { CREATED } = require('../utils/constants');
const NotFound = require('../errors/NotFound');
const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(next);
};

const getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFound('Не найдено');
      }
      return res.send(data);
    })
    .catch(next);
  return null;
};

const makeUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((data) => {
        const newUser = {
          name: data.name,
          about: data.about,
          avatar: data.avatar,
          email: data.email,
        };
        res.status(CREATED).send(newUser);
      })
      .catch(next);
  });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((data) => res.send(data))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const avatar = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, avatar, { new: true, runValidators: true })
    .then((data) => res.send(data))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        const err = new Unauthorized('Неверные почта или пароль');
        return next(err);
      }
      return bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (!result) {
            return next(new Unauthorized('Неверные почта или пароль'));
          }
          return user;
        })
        .then(() => {
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          return res.send({ token });
        });
    })
    .catch(next);
};

const infoUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((data) => res.send(data))
    .catch(next);
  return null;
};

module.exports = {
  getAllUsers,
  getUserId,
  makeUser,
  updateProfile,
  updateAvatar,
  login,
  infoUser,
};
