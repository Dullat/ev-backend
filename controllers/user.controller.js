const userModel = require("../models/user.model.js");
const BadRequestError = require("../errors/BadRequest.error.js");
const NotFoundError = require("../errors/NotFound.error.js");

const getAllUsers = async (req, res) => {
  const users = await userModel.find();

  if (!users || users.length === 0) {
    throw new NotFoundError("Users not found");
  }

  const usersArray = users.map((user) => {
    return {
      username: user.username,
      userId: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      favorites: user.favorites || [],
    };
  });

  res.status(200).json({
    success: true,
    message: "Users served successfully",
    users: usersArray,
  });
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  if (!userId) throw new BadRequestError("Please provide user id");

  const user = await userModel.findById(userId);

  if (!user) throw new NotFoundError("User does not exist");

  res.status(200).json({
    success: true,
    message: "User served successfully",
    user: {
      username: user.username,
      userId: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      favorites: user.favorites || [],
    },
  });
};

const updateUserNameById = async (req, res) => {
  const { name } = req.body;
  const { userId } = req.params;

  if (!userId) throw new BadRequestError("Please provide user id");

  const updatedUser = await userModel.findOneAndUpdate(
    { _id: userId },
    { name: name },
    { new: true },
  );

  if (!updatedUser) throw new NotFoundError("User does not exist");

  res.status(200).json({
    success: true,
    message: "Users updated successfully",
    user: {
      username: updatedUser.username,
      userId: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
      role: updatedUser.role,
      favorites: updatedUser.favorites || [],
    },
  });
};

const updateUserFavouriteStationsById = async (req, res) => {
  const { operationType, stationId } = req.body;
  const { userId } = req.params;

  if (!userId || !stationId || !["add", "remove"].includes(operationType))
    throw new BadRequestError("User id or operation type is missing");

  const user = await userModel.findById(userId);

  if (!user) throw new NotFoundError("User does not exist");

  if (operationType === "add") {
    if (!user.favorites.some((fav) => fav.toString() === stationId))
      user.favorites.push(stationId);
  } else if (operationType === "remove") {
    user.favorites = user.favorites.filter(
      (station) => station.toString() !== stationId,
    );
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Users updated successfully",
    favorites: user.favorites || [],
  });
};

const updatedUserProfileImageById = async (req, res) => {
  const { profileImageUrl } = req.body;
  const { userId } = req.params;

  if (!userId || !profileImageUrl)
    throw new BadRequestError("User id or imageUrl missing");

  const user = await userModel.findById(userId);

  if (user) {
    user.profileImage = profileImageUrl;
    await user.save();
  } else {
    throw new NotFoundError("User does not exist");
  }

  res.status(200).json({
    success: true,
    message: "Profile image updated successfully",
    profileImage: user.profileImage,
  });
};

module.exports = {
  getUserById,
  getAllUsers,
  updatedUserProfileImageById,
  updateUserNameById,
  updateUserFavouriteStationsById,
};
