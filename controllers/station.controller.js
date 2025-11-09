const stationModel = require("../models/station.model");
const favoriteModel = require("../models/favorite.model");
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

const getStationsByQuery = async (req, res) => {
  const { state, city, country } = req.query;
  console.log(state);

  const mongooseQuery = {};
  if (state) mongooseQuery.state = state.toLowerCase();
  if (city) mongooseQuery.city = city.toLowerCase();
  if (country) mongooseQuery.country = country.toLowerCase();

  console.log(mongooseQuery);
  const stations = await stationModel.find(mongooseQuery);

  if (!stations) throw new NotFoundError("Stations not found");

  res.status(200).json({
    success: true,
    message: "Stations found successfully",
    stations: stations,
  });
};

const getStationsByCoords = async (req, res) => {
  const { lat, lon, rad } = req.query;

  if (!lat || !lon) throw new BadRequestError("Please provide coordinates");

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180)
    throw new BadRequestError("Please provide valid coordinates");

  const stations = await stationModel.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lon), parseFloat(lat)],
        },
        $maxDistance: parseFloat(rad) || 200,
      },
    },
  });

  if (!stations) throw new NotFoundError("Stations not found");

  res.status(200).json({
    success: true,
    message: "Stations found successfully",
    stations: stations,
  });
};

const deleteStation = async (req, res) => {
  const { stationId } = req.params;
  if (!stationId) throw new BadRequestError("Please provide station id");

  const station = await stationModel.findById(stationId);

  if (!station) throw new NottFoundError("Station not found");

  if (station.addedBy.toString() !== req.decoded._id)
    throw new BadRequestError("You are not allowed to delete this station");

  await favoriteModel.deleteMany({ station: stationId });

  await stationModel.findByIdAndDelete(stationId);

  res.status(200).json({
    success: true,
    message: "Station deleted successfully",
  });
};

module.exports = {
  addStation,
  getStationById,
  getStationsByQuery,
  getStationsByCoords,
  deleteStation,
};
