"use strict";

const { UnauthorizedError } = require("../core/error.response");
const { PublicRoutes } = require("../utils/constants");
const jwt = require("jsonwebtoken");
const {
  jwt_config: { secret },
} = require("../config/environment");

const authentication = (req, res, next) => {
  if (!PublicRoutes.find((item) => `/v1/api` + item === req.originalUrl)) {
    next();
  } else {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      //verify token
      try {
        const decoded = jwt.verify(token, secret);
        req.user = {
          _id: decoded._id,
          email: decoded.email,
          name: decoded.name,
        };
        next();
      } catch (error) {
        throw new UnauthorizedError("Token is not valid!");
      }
    } else {
      throw new UnauthorizedError("Unauthorized!");
    }
  }
};

module.exports = authentication;
