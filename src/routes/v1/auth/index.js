"use strict";
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const authController = require("../../../controllers/auth.controller");

router.get("", (req, res) => {
  res.status(200).json({ message: "Get all user" });
});

//register
router.post("/signup", asyncHandler(authController.signup));

//login
router.post("/login", asyncHandler(authController.login));

module.exports = router;
