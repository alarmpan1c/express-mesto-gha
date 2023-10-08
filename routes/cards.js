const cardsRout = require('express').Router();
const { getAllCards } = require('../controllers/cards');
const { makeCard } = require('../controllers/cards');
const { deleteCardId } = require('../controllers/cards');
const { putLike } = require('../controllers/cards');
const { deleteLike } = require('../controllers/cards');
const {
  cardValid,
  cardIdValid,
} = require('../middlewares/validation');

cardsRout.get('/', getAllCards);

cardsRout.post('/', cardValid, makeCard);

cardsRout.delete('/:cardId', cardIdValid, deleteCardId);

cardsRout.put('/:cardId/likes', cardIdValid, putLike);

cardsRout.delete('/:cardId/likes', cardIdValid, deleteLike);

module.exports = cardsRout;
