require("donenv").config();
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors/unauthorized.error");

const authMiddleware = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies.accessToken ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!accessToken) {
      throw new UnauthorizedError("You are not logged in");
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await userModel.findById(decoded._id);

    req.decoded = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};
