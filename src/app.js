const express = require("express");
require("dotenv").config();

const app = express();

//init db
require("./config/mongodb");

module.exports = app;
