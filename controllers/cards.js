const Card = require('../models/cards');
const { CREATED } = require('../utils/constants');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(next);
};

const makeCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((data) => data.populate('owner'))
    .then((data) => res.status(CREATED).send(data))
    .catch(next);
  return null;
};

const deleteCardId = (req, res, next) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;
  return Card.findById(cardId)
    .then((data) => {
      if (!data) {
        return next(new NotFound('Карточка не найдена'));
      }

      // Проверяем, является ли текущий пользователь владельцем карточки
      if (data.owner.toString() !== ownerId.toString()) {
        return next(new Forbidden('У вас нет прав на удаление этой карточки'));
      }
      // Удаляем карточку, так как текущий пользователь - владелец
      return Card.deleteOne(data)
        .then((deletedCard) => {
          if (!deletedCard) {
            return next(new NotFound('Карточка не найдена'));
          }
          return res.send(data);
        })
        .catch(next);
    })
    .catch(next);
};

const putLike = (req, res, next) => {
  const owner = req.user._id;
  const _id = req.params.cardId;
  Card.findByIdAndUpdate(_id, { $addToSet: { likes: owner } }, { new: true })
    .then((data) => {
      if (!data) {
        return next(new NotFound('Не найдено'));
      }
      return res.send(data);
    })
    .catch(next);
  return null;
};

const deleteLike = (req, res, next) => {
  const owner = req.user._id;
  const _id = req.params.cardId;
  Card.findByIdAndUpdate(_id, { $pull: { likes: owner } }, { new: true })
    .then((data) => {
      if (!data) {
        return next(new NotFound('Не найдено'));
      }
      return res.send(data);
    })
    .catch(next);
  return null;
};

module.exports = {
  getAllCards,
  makeCard,
  deleteCardId,
  putLike,
  deleteLike,
};
