require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const UnauthorizedError = require("../errors/Unauthorized.error");

const authMiddleware = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies.accessToken ||
      req.headers["authorization"]?.replace("Bearer ", "");

    console.log(accessToken);

    if (!accessToken) {
      throw new UnauthorizedError("You are not logged in");
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    const user = await userModel.findById(decoded._id);

    req.decoded = decoded;
    next();
  } catch (error) {
    console.log(error);
    throw new UnauthorizedError("Invalid or expired token", error);
  }
};

module.exports = authMiddleware;
