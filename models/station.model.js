const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      lowercase: true,
    },
    street: {
      type: String,
      required: [true, "Please provide an address"],
      lowercase: true,
    },
    city: {
      type: String,
      required: [true, "Please provide a city"],
      lowercase: true,
    },
    state: {
      type: String,
      required: [true, "Please provide a state"],
      lowercase: true,
    },
    country: {
      type: String,
      required: [true, "Please provide a country"],
      lowercase: true,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Pleaase provide a user"],
    },
  },
  { timestamps: true },
);

stationSchema.index({ location: "2dsphere" });
stationSchema.index({ city: 1, state: 1, country: 1 });

module.exports = mongoose.model("Station", stationSchema);
