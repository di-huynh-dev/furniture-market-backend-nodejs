const { Roles } = require("../utils/constants");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  UnauthorizedError,
} = require("../core/error.response");
const jwt = require("jsonwebtoken");
const {
  jwt_config: { secret, expire },
} = require("../config/environment");

class AuthService {
  static signup = async ({ email, password, name, gender, birthDate }) => {
    // Check account exist
    const isExist = await userModel.findOne({ email }).lean();
    if (isExist) {
      throw new BadRequestError("Account already exists!");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccount = await userModel.create({
      email,
      password: hashedPassword,
      name,
      gender,
      birthDate,
      roles: [Roles.USER],
    });

    if (newAccount) {
      return {
        user: getInfoData({
          fields: ["_id", "name", "email", "gender", "birthDate"],
          object: newAccount,
        }),
      };
    }

    return {
      message: "Create Account Error",
      metadata: null,
    };
  };

  static login = async ({ email, password }) => {
    const user = await userModel.findOne({ email }).lean();

    //Check user exist
    if (!user) {
      throw new BadRequestError(" Account not registered!");
    }

    //Check password
    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      throw new UnauthorizedError("Wrong password!");
    } else {
      // Create token
      const payload = {
        _id: user._id,
        email: user.email,
        name: user.name,
      };
      const accessToken = this.createAccessToken(payload);
      const refreshToken = this.createRefreshToken(payload);
      this.updateUserRefreshToken(user._id, refreshToken);

      return {
        token: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        user: getInfoData({
          fields: ["_id", "name", "email"],
          object: user,
        }),
      };
    }
  };

  static refreshToken = async ({ refreshToken }) => {
    //Find user by refreshToken
    const user = await userModel.findOne({ refreshToken });

    if (!user) {
      throw new UnauthorizedError("Unauthorization!");
    }
    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    const newRefreshToken = this.createRefreshToken(payload);
    const accessToken = this.createAccessToken(payload);
    await this.updateUserRefreshToken(user._id, newRefreshToken);

    return {
      token: {
        accessToken,
        refreshToken: newRefreshToken,
      },
      user: getInfoData({
        fields: ["_id", "name", "email"],
        object: user,
      }),
    };
  };

  static createAccessToken = (payload) => {
    const accessToken = jwt.sign(payload, secret, {
      expiresIn: expire,
    });
    return accessToken;
  };

  static createRefreshToken = (payload) => {
    const accessToken = jwt.sign(payload, secret, {
      expiresIn: expire * 4 * 24,
    });
    return accessToken;
  };

  static updateUserRefreshToken = async (_id, refreshToken) => {
    await userModel.findByIdAndUpdate(
      {
        _id,
      },
      { refreshToken }
    );
  };
}

module.exports = AuthService;
