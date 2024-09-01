"use strict";

const express = require("express");
const router = express.Router();
const authentication = require("../../middlewares/jwt.middleware");

router.all("*", authentication);
router.use("/api/auth", require("./auth"));

module.exports = router;
