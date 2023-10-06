const cardsRout = require('express').Router();
const { getAllCards } = require('../controllers/cards');
const { makeCard } = require('../controllers/cards');
const { deleteCardId } = require('../controllers/cards');
const { putLike } = require('../controllers/cards');
const { deleteLike } = require('../controllers/cards');

cardsRout.get('/', getAllCards);

cardsRout.post('/', makeCard);

cardsRout.delete('/:cardId', deleteCardId);

cardsRout.put('/:cardId/likes', putLike);

cardsRout.delete('/:cardId/likes', deleteLike);

module.exports = cardsRout;
