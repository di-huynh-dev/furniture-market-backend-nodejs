const express = require("express");
const {
  notFoundMiddleware,
  errorHandlingMiddleware,
} = require("./middlewares/handleError.middleware");
const cors = require("cors");

require("dotenv").config();

const app = express();

//config cors
// app.use(cors);

//config req.body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

//init db
require("./config/mongodb");

//init routes
app.use("/v1", require("./routes/v1"));

// Handle 404 Not Found errors
app.use(notFoundMiddleware);

// Error handling middleware
app.use(errorHandlingMiddleware);

module.exports = app;
