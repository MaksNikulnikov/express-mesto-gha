const http2 = require('node:http2');

const constants = {
  NOT_FOUND: http2.constants.HTTP_STATUS_NOT_FOUND,
  BAD_REQUEST: http2.constants.HTTP_STATUS_BAD_REQUEST,
  INTERNAL_SERVER_ERROR: http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
};

module.exports = constants;
