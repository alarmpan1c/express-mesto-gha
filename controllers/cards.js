const Card = require('../models/cards');
const { BAD_REQUEST, NOT_FOUND, SERVER_INTERNAL_ERROR } = require('../utils/constants');

const getAllCards = (req, res) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
      console.log(error.name);
    });
};

const makeCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((data) => data.populate('owner'))
    .then((data) => res.send(data))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Неверные данные' });
      }
      return res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
    });
  return null;
};

const deleteCardId = (req, res) => {
  const _id = req.params.cardId;
  if (_id.length < 24) {
    return res.status(BAD_REQUEST).send({ message: 'Неверные данные' });
  }
  Card.findByIdAndDelete({ _id })
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
      return res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
    });
  return null;
};

const putLike = (req, res) => {
  const owner = req.user._id;
  const _id = req.params.cardId;
  if (_id.length < 24) {
    return res.status(BAD_REQUEST).send({ message: 'Неверные данные' });
  }
  Card.findByIdAndUpdate(_id, { $addToSet: { likes: owner } }, { new: true })
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
      return res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
    });
  return null;
};

const deleteLike = (req, res) => {
  const owner = req.user._id;
  const _id = req.params.cardId;
  if (_id.length < 24) {
    return res.status(BAD_REQUEST).send({ message: 'Неверные данные' });
  }
  Card.findByIdAndUpdate(_id, { $pull: { likes: owner } }, { new: true })
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
      return res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
    });
  return null;
};

module.exports = {
  getAllCards,
  makeCard,
  deleteCardId,
  putLike,
  deleteLike,
};
