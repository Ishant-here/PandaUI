const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
} = require("../Controllers/payment.controller");

const isAuth = require("../MiddleWare/isAuth.middleware");

router.post("/create-order", isAuth, createOrder);
router.post("/verify", isAuth, verifyPayment);

module.exports = router;