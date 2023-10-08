const bcrypt = require('bcrypt');
const User = require('../models/users');
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  SERVER_INTERNAL_ERROR,
} = require('../utils/constants');
const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;

const getAllUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch((error) => {
      res
        .status(SERVER_INTERNAL_ERROR)
        .send({ message: 'Что-то пошло не так' });
      console.log(error.name);
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;
  if (userId.length < 24) {
    return res.status(BAD_REQUEST).send({ message: 'Неверные данные' });
  }
  User.findById(userId)
    .then((data) => {
      if (!data) {
        return res.status(NOT_FOUND).send({ message: 'Не найдено' });
      }
      return res.send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Невалидное ID' });
      }
      return res
        .status(SERVER_INTERNAL_ERROR)
        .send({ message: 'Что-то пошло не так' });
    });
  return null;
};

const makeUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((data) => res.send(data))
      .catch((error) => {
        if (error.name === 'ValidationError') {
          console.log(error);
          res.status(BAD_REQUEST).send({ message: 'Неверные данные' });
        } else if (error.code === 11000) {
          res.status(BAD_REQUEST).send({ message: 'Пользователь с таким email уже существует' });
        } else {
          res
            .status(SERVER_INTERNAL_ERROR)
            .send({ message: 'Что-то пошло не так' });
        }
        console.log(error.code);
      });
  });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((data) => res.send(data))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Неверные данные' });
      } else if (error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Невалидное ID' });
      } else {
        res
          .status(SERVER_INTERNAL_ERROR)
          .send({ message: 'Что-то пошло не так' });
      }
      console.log(error.name);
    });
};

const updateAvatar = (req, res) => {
  const avatar = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, avatar, { new: true, runValidators: true })
    .then((data) => res.send(data))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Неверные данные' });
      } else if (error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Невалидное ID' });
      } else {
        res
          .status(SERVER_INTERNAL_ERROR)
          .send({ message: 'Что-то пошло не так' });
      }
      console.log(error.name);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return res.status(UNAUTHORIZED).send({ message: 'Неверные почта или пароль' });
      }
      return bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (!result) {
            return res.status(UNAUTHORIZED).send({ message: 'Неверные почта или пароль' });
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
    .catch((error) => {
      res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
      console.log(error);
    });
};

const infoUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((data) => res.send(data))
    .catch((error) => {
      res
        .status(SERVER_INTERNAL_ERROR)
        .send({ message: 'Что-то пошло не так' });
      console.log(error.name);
    });
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
