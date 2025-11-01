const CustomError = require("./custom.error");

class InternalServerError extends CustomError {
  constructor(message) {
    super(message, 500);
  }
}

module.exports = InternalServerError;
