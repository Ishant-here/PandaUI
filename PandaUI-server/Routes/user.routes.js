const express = require("express");

const router = express.Router();

const { getCurrentUser, getAllUsers } = require("../Controllers/user.controller");
const isAuth = require("../MiddleWare/isAuth.middleware");

router.get("/current-user", isAuth, getCurrentUser);
router.get("/all-users", isAuth, getAllUsers);

module.exports = router;