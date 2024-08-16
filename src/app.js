const express = require("express");
require("dotenv").config();

const app = express();

//init db
require("./config/mongodb");

//init routes
app.use("/v1", require("./routes/v1"));

// Handle 404 Not Found errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use((error, req, res, next) => {
  const status = error.status || 500;
  return res.status(status).json({
    status: "error",
    code: status,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
