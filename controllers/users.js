const User = require('../models/users');
const { BAD_REQUEST, NOT_FOUND, SERVER_INTERNAL_ERROR } = require('../utils/constants');

const getAllUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
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
        return res.status(NOT_FOUND).send({ message: 'Не найдено' });
      }
      return res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
    });
  return null;
};

const makeUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((data) => res.send(data))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Неверные данные' });
      } else {
        res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
      }
      console.log(error.name);
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((data) => res.send(data))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Неверные данные' });
      } else if (error.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Не найдено' });
      } else {
        res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
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
        res.status(NOT_FOUND).send({ message: 'Не найдено' });
      } else {
        res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
      }
      console.log(error.name);
    });
};

module.exports = {
  getAllUsers,
  getUserId,
  makeUser,
  updateProfile,
  updateAvatar,
};
