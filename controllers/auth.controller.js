const BadRequestError = require("../errors/BadRequest.error.js");
const InernalServerError = require("../errors/InternalServer.error.js");
const userModel = require("../models/user.model.js");
const userTokenModel = require("../models/userToken.model.js");
const { genAccessToken, genRefreshToken } = require("../utility/genToken.js");

const createUser = async (req, res) => {
  const { name, username, email, password, role } = req.body;

  if (!name || !username || !email || !password || !role) {
    throw new BadRequestError("Please provide all values");
  }

  alreadyUsed = await userModel.findOne({ email });

  if (alreadyUsed) {
    throw new BadRequestError("Email is already in use");
  }

  const user = await userModel.create(req.body);
  const accessToken = genAccessToken({ _id: user._id, email: user.email });
  const refreshToken = genRefreshToken({ _id: user._id, email: user.email });

  const token = await userTokenModel.create({
    userId: user._id,
    refreshToken,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });

  if (!token || !user) {
    throw new InternalServerError("Failed to create user and token");
  }

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 5,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "api/auth/",
    });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    accessToken: accessToken,
    refreshToken: refreshToken,
    user: {
      username: user.username,
      userId: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      favorites: user.favorites || "",
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError("Please provide all values");

  const user = await userModel.findOne({ email });

  if (!user) throw new NotFoundError("User not found");

  const doesPasswordMatch = await user.comparePassword(password);

  if (!doesPasswordMatch) throw new BadRequestError("Password does not match");

  const accessToken = genAccessToken({ _id: user._id, email: user.email });
  const refreshToken = genRefreshToken({ _id: user._id, email: user.email });

  const token = await userTokenModel.create({
    userId: user._id,
    refreshToken: refreshToken,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });

  if (!token || !user) {
    throw new InternalServerError("Failed to create user and token");
  }

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 5,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "api/auth/",
    });

  res.status(201).json({
    success: true,
    message: "Login successful",
    accessToken: accessToken,
    refreshToken: refreshToken,
    user: {
      username: user.username,
      userId: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      favorites: user.favorites || "",
    },
  });
};

const getUser = async (req, res) => {
  if (!req.body.userId) throw new BadRequestError("Please Provide user id");
  const user = await userModel.findById(req.body.userId);
  res.status(200).json({
    success: true,
    message: "User found successfully",
    user: {
      username: user.username,
      userId: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      favorites: user.favorites || "",
    },
  });
};

const logoutUser = async (req, res) => {
  await userTokenModel.deleteMany({ userId: req.userId });
  res.clearCookie("accessToken").clearCookie("refreshToken");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = {
  createUser,
  getUser,
  loginUser,
  logoutUser,
};
