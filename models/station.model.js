const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    address: {
      type: String,
      required: [true, "Please provide an address"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    chargerType: {
      type: String,
      enum: ["normal", "fast", "slow"],
    },
    plugType: {
      type: [String],
      enum: [
        "Type2", // Common AC connector in India
        "CCS2", // Fast DC charger for most modern EVs
        "CHAdeMO", // Japanese DC fast charger (less common)
        "GB/T", // Used in Bharat DC-001 chargers
        "BharatAC001", // AC standard for light EVs
        "BharatDC001", // DC standard for light EVs
      ],
      required: true,
    },
    pricePerKwh: {
      type: Number,
      required: [true, "Pleaase provide a price"],
      min: [0, "Price must be positive"],
    },
    available: {
      type: Boolean,
      default: true,
    },
    images: [
      {
        type: String,
      },
    ],
    ratings: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    owner: {
      name: {
        type: String,
        default: "Unknown",
      },
      link: {
        type: String,
        default: "",
      },
    },
    addedBy: {
      type: mongoose.Schema.Type.ObjectId,
      ref: "User",
      required: [true, "Pleaase provide a user"],
    },
  },
  { timestamps: true },
);

staionSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Station", stationSchema);
