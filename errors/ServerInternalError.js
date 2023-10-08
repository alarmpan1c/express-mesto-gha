const { SERVER_INTERNAL_ERROR } = require('../utils/constants');

class ServerInternalError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = SERVER_INTERNAL_ERROR;
  }
}

module.exports = ServerInternalError;
