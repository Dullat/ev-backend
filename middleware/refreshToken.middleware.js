require("dotenv").config();
const jwt = require("jsonwebtoken");
const userTokenModel = require("../models/userToken.model");
const userModel = require("../models/user.model");
const BadRequestError = require("../errors/BadRequest.error");

const refreshTokenMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) throw new Error("No refresh token provided");

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const dbToken = await userTokenModel.findOne({
      refreshToken: token,
      userId: decoded._id,
    });

    if (!decoded || !dbToken) throw new Error("Token expired");

    const user = await userModel.findById(decoded._id);

    if (!user) throw new Error("User not found");

    req.decoded = decoded;
    console.log("passed from middleware");
    next();
  } catch (error) {
    console.log(error);
    throw new BadRequestError(error);
  }
};

module.exports = refreshTokenMiddleware;
