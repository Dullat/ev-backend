const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    role: {
      type: String,
      enum: ["driver", "owner", "admin"],
      default: "driver",
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station",
      },
    ],
    profileImage: {
      type: String,
      default: "example.com",
    },
  },
  { timestamps: true },
);
