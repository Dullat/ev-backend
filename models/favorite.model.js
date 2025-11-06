const mongoose = require("mongoose");
const stationSchema = require("./station.model");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: [true, "Please provide a station"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Favourte", favoriteSchema);
