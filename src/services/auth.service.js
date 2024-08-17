const { Roles } = require("../utils/constants");
const {
  BadRequestError,
  UnauthorizedError,
} = require("../core/error.response");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { getInfoData } = require("../utils");
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
        email: user.email,
        name: user.name,
      };
      const accessToken = jwt.sign(payload, secret, {
        expiresIn: expire,
      });

      return {
        accessToken: accessToken,
        user: getInfoData({
          fields: ["_id", "name", "email"],
          object: user,
        }),
      };
    }
  };
}

module.exports = AuthService;
