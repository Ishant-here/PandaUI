const express = require("express");

const router = express.Router();

const authController = require("../Controllers/auth.controller");

router.post("/google", authController.googleAuth);

router.post("/logout", authController.logout);

module.exports = router;