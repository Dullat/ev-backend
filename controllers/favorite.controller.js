const favoriteModel = require("../models/favorite.model");
const NotFoundError = require("../errors/NotFound.error");
const BadRequestError = require("../errors/BadRequest.error");

const toggleFavorite = async (req, res) => {
  const { stationId } = req.params;
  const userId = req.decoded._id;

  console.log(userId);

  if (!stationId) throw new BadRequestError("Please provide station id");
  const favorite = await favoriteModel.findOne({
    user: userId,
    station: stationId,
  });
  if (favorite) {
    await favorite.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: "Favorite deleted successfully" });
  }

  favoriteModel.create({ user: userId, station: stationId });

  res
    .status(200)
    .json({ success: true, message: "Favorite added successfully" });
};

const getFavorites = async (req, res) => {
  const userId = req.decoded._id;
  const favorites = await favoriteModel.find({ user: userId });
  res.status(200).json({ favorites });
};

const getFavoriteCount = async (req, res) => {
  const { stationId } = req.params;
  const count = await favoriteModel.countDocuments({ station: stationId });
  res.status(200).json({ count });
};

module.exports = {
  toggleFavorite,
  getFavorites,
  getFavoriteCount,
};
