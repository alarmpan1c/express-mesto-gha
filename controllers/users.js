const User = require('../models/users');

const getAllUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status('400').send({ message: 'Неверные данные' });
      } else if (error.name === 'CastError') {
        res.status('404').send({ message: 'Не найдено' });
      } else {
        res.status('500').send({ message: 'Что-то пошло не так' });
      }
      console.log(error.name);
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((data) => res.send(data))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status('400').send({ message: 'Неверные данные' });
      } else if (error.name === 'CastError') {
        res.status('404').send({ message: 'Не найдено' });
      } else {
        res.status('500').send({ message: 'Что-то пошло не так' });
      }
      console.log(error.name);
    });
};

const makeUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((data) => res.send(data))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status('400').send({ message: 'Неверные данные' });
      } else if (error.name === 'CastError') {
        res.status('404').send({ message: 'Не найдено' });
      } else {
        res.status('500').send({ message: 'Что-то пошло не так' });
      }
      console.log(error.name);
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const _id = req.user._id;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((data) => res.send(data))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status('400').send({ message: 'Неверные данные' });
      } else if (error.name === 'CastError') {
        res.status('404').send({ message: 'Не найдено' });
      } else {
        res.status('500').send({ message: 'Что-то пошло не так' });
      }
      console.log(error.name);
    });
};

const updateAvatar = (req, res) => {
  const avatar = req.body;
  const _id = req.user._id;
  User.findByIdAndUpdate(_id, avatar, { new: true, runValidators: true })
    .then((data) => res.send(data))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status('400').send({ message: 'Неверные данные' });
      } else if (error.name === 'CastError') {
        res.status('404').send({ message: 'Не найдено' });
      } else {
        res.status('500').send({ message: 'Что-то пошло не так' });
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
