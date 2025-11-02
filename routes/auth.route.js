const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.route("/api/auth/register").post(authController.createUser);
router.route("/api/auth/login").post(authController.loginUser);
router.route("/api/auth/me").get(authMiddleware, authController.getUser);
router.route("/api/auth/logout").post(authController.logoutUser);

module.exports = router;
