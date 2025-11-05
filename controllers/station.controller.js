const stationModel = require("../models/station.model");
const BadRequestError = require("../errors/BadRequest.error");
const NotFoundError = require("../errors/NotFound.error");
const GeCoder = require("../services/GeCoder");

const addStation = async (req, res) => {
  const {
    name,
    street,
    city,
    state,
    country,
    coordinates,
    chargerType,
    pricePerKwh,
    ownerName,
    ownerLink,
  } = req.body;

  const userId = req.decoded._id;

  const location = {
    type: "Point",
    coordinates: { lat: coordinates.lat, lon: coordinates.lon },
  };

  const address = await GeCoder(coordinates);

  const station = await stationModel.create({
    name,
    street: address.street || street,
    city: address.city || city,
    state: address.state || state,
    country: address.country || country,
    location: {
      type: "Point",
      coordinates: [coordinates.lon, coordinates.lat],
    },
    chargerType,
    pricePerKwh,
    ownerName,
    ownerLink,
    addedBy: userId,
  });

  if (!station) throw new BadRequestError("Maybe wrong data");

  res.status(200).json({
    success: true,
    message: "Station added successfully",
    station: station,
  });
};

const getStationById = async (req, res) => {
  const { stationId } = req.params;

  if (!stationId) throw new BadRequestError("Please provide station id");

  const station = await stationModel.findById(stationId);

  if (!station) throw new NotFoundError("Station not found");

  res.status(200).json({
    success: true,
    message: "Station found successfully",
    station: station,
  });
};

module.exports = {
  addStation,
  getStationById,
};
