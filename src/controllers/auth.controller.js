"use strict";

const authService = require("../services/auth.service");
const { CREATED, OK } = require("../core/success.response");

class AuthController {
  signup = async (req, res, next) => {
    new CREATED({
      message: "Signup successfully!",
      metadata: await authService.signup(req.body),
    }).send(res);
  };

  login = async (req, res, next) => {
    new OK({
      message: "Login successfully!",
      metadata: await authService.login(req.body),
    }).send(res);
  };

  refreshToken = async (req, res, next) => {
    new OK({
      message: "Refresh token successfully!",
      metadata: await authService.refreshToken(req.body),
    }).send(res);
  };
}

module.exports = new AuthController();
