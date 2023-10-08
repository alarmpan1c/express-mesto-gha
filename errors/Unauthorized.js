/* eslint-disable linebreak-style */

const { UNAUTHORIZED } = require('../utils/constants');

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = Unauthorized;
