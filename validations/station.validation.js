const joi = require("joi");
const validator = require("validator");

const stationSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  street: joi.string().min(3).max(30).required(),
  city: joi.string().min(3).max(30).required(),
  state: joi.string().min(3).max(30).required(),
  country: joi.string().min(3).max(30).required(),
  coordinates: joi.object({
    lat: joi.number().min(-90).max(90).required(),
    lon: joi.number().min(-180).max(180).required(),
  }),
  chargerType: joi.string().min(3).max(30).required(),
  pricePerKwh: joi.number().required(),
  ownerName: joi.string().min(3).max(30).required(),
  ownerLink: joi
    .string()
    .uri()
    .allow("", null)
    .optional()
    .custom((value, helpers) => {
      if (value && !validator.isURL(value, { require_protocol: true })) {
        return helpers.error("Invalid URL format");
      }
      return value;
    }),
});

const stationQuerySchema = joi.object({
  city: joi.string().min(3).max(30).optional(),
  state: joi.string().min(3).max(30).optional(),
  country: joi.string().min(3).max(30).optional(),
});

module.exports = {
  stationQuerySchema,
  stationSchema,
};
