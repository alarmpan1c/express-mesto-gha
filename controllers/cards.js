const Card = require('../models/cards');

const getAllCards = (req, res) => {
  Card.find({})
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

const makeCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((data) => data.populate('owner'))
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

const deleteCardId = (req, res) => {
  const _id = req.params.cardId;
  if (_id.length < 24) {
    return res.status(400).send({ message: 'Неверные данные' });
  }
  Card.findByIdAndDelete({ _id })
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: 'Не найдено' });
      }
      res.send(data);
    })
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

const putLike = (req, res) => {
  const owner = req.user._id;
  const _id = req.params.cardId;
  if (_id.length < 24) {
    return res.status(400).send({ message: 'Неверные данные' });
  }
  Card.findByIdAndUpdate(_id, { $addToSet: { likes: owner } }, { new: true })
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: 'Не найдено' });
      }
      res.send(data);
    })
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

const deleteLike = (req, res) => {
  const owner = req.user._id;
  const _id = req.params.cardId;
  if (_id.length < 24) {
    return res.status(400).send({ message: 'Неверные данные' });
  }
  Card.findByIdAndUpdate(_id, { $pull: { likes: owner } }, { new: true })
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: 'Не найдено' });
      }
      res.send(data);
    })
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
  getAllCards,
  makeCard,
  deleteCardId,
  putLike,
  deleteLike,
};
