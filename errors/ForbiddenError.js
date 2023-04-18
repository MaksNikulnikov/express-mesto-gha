const http2 = require('http2');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = http2.constants.HTTP_STATUS_FORBIDDEN;
  }
}

module.exports = ForbiddenError;
