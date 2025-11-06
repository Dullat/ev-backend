const { stationQuerySchema } = require("../validations/station.validation");
const BadRequestError = require("../errors/BadRequest.error");

const validateRequestMiddleware =
  (schema, source = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      throw new BadRequestError(message);
    }
    console.log(value);
    req[source] = value;
    next();
  };

module.exports = validateRequestMiddleware;
