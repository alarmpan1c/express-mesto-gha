const { CastError } = require('mongoose');

const {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  SERVER_INTERNAL_ERROR,
} = require('../utils/constants');

const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');
const NotFound = require('../errors/NotFound');
const Unauthorized = require('../errors/Unauthorized');
const Forbidden = require('../errors/Forbidden');

module.exports = (err, req, res, next) => {
  console.log('errorlog', err);
  if (err.code === 11000) {
    return res.status(CONFLICT).send({ message: 'Пользователь с таким email уже существует' });
  }
  if (err instanceof CastError) {
    return res.status(BAD_REQUEST).send({ message: err.message });
  }
  if (err instanceof ConflictError) {
    return res.status(CONFLICT).send({ message: err.message });
  }
  if (err instanceof NotFound) {
    return res.status(NOT_FOUND).send({ message: err.message });
  }
  if (err instanceof BadRequest) {
    return res.status(BAD_REQUEST).send({ message: err.message });
  }
  if (err instanceof Unauthorized) {
    return res.status(UNAUTHORIZED).send({ message: err.message });
  }
  if (err instanceof Forbidden) {
    return res.status(FORBIDDEN).send({ message: err.message });
  }
  res.status(SERVER_INTERNAL_ERROR).send({ message: err.message });
  return next();
};
