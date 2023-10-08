const Card = require('../models/cards');
const {
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
  // SERVER_INTERNAL_ERROR,
} = require('../utils/constants');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(next);
  // (error) => {
  // res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
  // console.log(error);
  // });
};

const makeCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((data) => data.populate('owner'))
    .then((data) => res.send(data))
    .catch(next);
  // (error) => {
  // if (error.name === 'ValidationError') {
  //   return res.status(BAD_REQUEST).send({ message: 'Неверные данные' });
  // }
  // return res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
  // });
  return null;
};

const deleteCardId = (req, res, next) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;

  if (cardId.length < 24) {
    return res.status(BAD_REQUEST).send({ message: 'Неверные данные' });
  }

  return Card.findById(cardId)
    .then((data) => {
      if (!data) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }

      // Проверяем, является ли текущий пользователь владельцем карточки
      if (data.owner.toString() !== ownerId.toString()) {
        return res.status(FORBIDDEN).send({ message: 'У вас нет прав на удаление этой карточки' });
      }
      // Удаляем карточку, так как текущий пользователь - владелец
      return Card.findByIdAndDelete(cardId)
        .then((deletedCard) => {
          if (!deletedCard) {
            return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
          }
          return res.send(deletedCard);
        })
        .catch(next);
      // (error) => {
      // if (error.name === 'CastError') {
      //   return res.status(BAD_REQUEST).send({ message: 'Невалидное ID' });
      // }
      // return res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
      // });
    })
    .catch(next);
  // (error) => {
  // if (error.name === 'CastError') {
  //   return res.status(BAD_REQUEST).send({ message: 'Невалидное ID' });
  // }
  // return res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
  // });
};

const putLike = (req, res, next) => {
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
    .catch(next);
  // (error) => {
  // if (error.name === 'CastError') {
  //   return res.status(BAD_REQUEST).send({ message: 'Невалидное ID' });
  // }
  // return res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
  // });
  return null;
};

const deleteLike = (req, res, next) => {
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
    .catch(next);
  // (error) => {
  // if (error.name === 'CastError') {
  //   return res.status(BAD_REQUEST).send({ message: 'Невалидное ID' });
  // }
  // return res.status(SERVER_INTERNAL_ERROR).send({ message: 'Что-то пошло не так' });
  // });
  return null;
};

module.exports = {
  getAllCards,
  makeCard,
  deleteCardId,
  putLike,
  deleteLike,
};
