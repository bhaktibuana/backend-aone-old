const {
  User,
  UserRole,
  UserLogin,
  UserRepo,
  Op,
  sequelize,
} = require("../../models");
const {
  generateJwt,
  hashPassword,
  response,
  serverErrorResponse,
  capitalizeName,
  parseFullName,
  consoleError,
  generateMetadata,
  parseDevice,
} = require("../../utils");
const { emailService, otpService } = require("../../services");
const { config } = require("../../configs");
const moment = require("moment");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { userRoleList } = res.locals;
  const bodyParams = req.body;
  const appBaseUrl = bodyParams.appBaseUrl;

  const payload = {
    username: bodyParams.username,
    email: bodyParams.email.toLowerCase(),
    password: hashPassword(bodyParams.password),
    firstName: capitalizeName(bodyParams.firstName),
    lastName: capitalizeName(bodyParams.lastName),
    userRoleId: userRoleList.filter((item) => item.code === "RG")[0].id,
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
    inactive: false,
    verified: false,
  };

  const repoUuid = crypto.randomUUID();
  const repoPayload = (userId) => ({
    userId,
    uuid: repoUuid,
    apiKey: generateJwt({ uuid: repoUuid }, false),
  });

  try {
    await sequelize.transaction(async (transaction) => {
      const result = await User.create(payload, { transaction });
      await UserLogin.create({ userId: result.dataValues.id }, { transaction });
      await UserRepo.create(repoPayload(result.dataValues.id), { transaction });

      const verifyToken = generateJwt({ id: result.dataValues.id }, false);
      const emailContext = {
        fullName: parseFullName(
          result.dataValues.firstName,
          result.dataValues.lastName
        ),
        loginUrl: `${appBaseUrl}/login`,
        username: result.dataValues.username,
        email: result.dataValues.email,
        actionUrl: `${appBaseUrl}/verify?type=email&token=${verifyToken}`,
      };

      transaction.afterCommit(() => {
        emailService.sendEmail(
          "Welcome to Aone",
          "verifyRegister",
          emailContext,
          {
            to: result.dataValues.email,
          }
        );

        delete result.dataValues.password;
        response("Register user success", 201, res, result);
      });
    });
  } catch (error) {
    consoleError("Server Error", error);
    serverErrorResponse(error, res);
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.body;

  const payload = {
    updatedAt: moment().toDate(),
    verified: true,
  };

  try {
    const verifyToken = jwt.verify(token, config.jwtSecretKey, {
      algorithms: ["HS256"],
    });
    await User.update(payload, { where: { id: verifyToken.id } });
    const result = await User.findOne({
      where: { id: verifyToken.id },
      attributes: { exclude: ["password"] },
    });

    if (result.dataValues.verified) {
      response("Verify email success", 200, res, result);
    } else {
      response("Verify email failed", 400, res);
    }
  } catch (error) {
    consoleError("Server Error", error);
    serverErrorResponse(error, res);
  }
};

const login = async (req, res) => {
  const { device } = res.locals;
  const { username, password } = req.body;

  // use hashed password from request payload
  const hashedPassword = hashPassword(password); // only for testing e.g: via postman

  const userLoginPayload = (otpToken) => ({
    userAgent: req.headers["user-agent"],
    device: parseDevice(device),
    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    otpToken,
  });

  try {
    const result = await User.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ username }, { email: username }],
          },
          {
            [Op.or]: [{ password }, { password: hashedPassword }],
          },
        ],
      },
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });

    if (result) {
      if (result.dataValues.inactive) {
        response("Inactive account", 400, res);
        return;
      }
      if (!result.dataValues.verified) {
        response("Unverified account", 400, res);
        return;
      }

      const generateOtpPayload = otpService.generateOtp();

      await UserLogin.update(userLoginPayload(generateOtpPayload.otpToken), {
        where: { userId: result.dataValues.id },
      });

      emailService.sendEmail(
        "OTP Code for Your Aone Account",
        "otpLogin",
        { otp: generateOtpPayload.otp },
        { to: result.dataValues.email }
      );

      response("Success, OTP sent to selected email", 200, res, {
        userId: result.dataValues.id,
        ...userLoginPayload(generateOtpPayload.otpToken),
      });
    } else {
      response("Login failed, wrong username or password", 404, res);
    }
  } catch (error) {
    consoleError("Server Error", error);
    serverErrorResponse(error, res);
  }
};

const regenerateOtp = async (req, res) => {
  const { device } = res.locals;
  const { userId } = req.body;

  const userLoginPayload = (otpToken) => ({
    userAgent: req.headers["user-agent"],
    device: parseDevice(device),
    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    otpToken,
  });

  const generateOtpPayload = otpService.generateOtp();

  try {
    const result = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });

    await UserLogin.update(userLoginPayload(generateOtpPayload.otpToken), {
      where: { userId },
    });

    if (result) {
      emailService.sendEmail(
        "OTP Code for Your Aone Account",
        "otpLogin",
        { otp: generateOtpPayload.otp },
        { to: result.dataValues.email }
      );

      response("Regenerate success, OTP sent to selected email", 200, res, {
        userId: result.dataValues.id,
        ...userLoginPayload(generateOtpPayload.otpToken),
      });
    } else {
      response("Regenerate OTP failed", 400, res);
    }
  } catch (error) {
    consoleError("Server Error", error);
    serverErrorResponse(error, res);
  }
};

const verifyLogin = async (req, res) => {
  const { device } = res.locals;
  const { userId, otp } = req.body;

  const userLoginPayload = {
    userAgent: req.headers["user-agent"],
    device: parseDevice(device),
    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    otpToken: null,
    lastLoginAt: moment().toDate(),
  };

  try {
    const userLoginResult = await UserLogin.findOne({
      where: { userId },
    });
    const verifyOtpPayload = otpService.verifyOtp(
      otp,
      userLoginResult.dataValues.otpToken
    );

    if (verifyOtpPayload.verified) {
      const result = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: UserRole,
            required: true,
          },
        ],
      });

      const token = generateJwt(result.dataValues);
      await UserLogin.update(userLoginPayload, {
        where: { userId },
      });

      response("Login success", 200, res, { id: result.dataValues.id, token });
    } else {
      response(verifyOtpPayload.message, 400, res);
    }
  } catch (error) {
    consoleError("Server Error", error);
    serverErrorResponse(error, res);
  }
};

const getDetail = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await User.findOne({
      where: { id, inactive: false },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: UserRole,
          required: true,
        },
      ],
    });

    if (result) {
      response("User data", 200, res, result);
    } else {
      response("User data not found", 404, res);
    }
  } catch (error) {
    consoleError("Server Error", error);
    serverErrorResponse(error, res);
  }
};

const getData = async (req, res) => {
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;

  try {
    const count = await User.count();
    const metadata = generateMetadata(req, count, offset, limit);
    const result = await User.findAll({
      include: [
        {
          model: UserRole,
          required: true,
        },
      ],
      attributes: {
        exclude: ["password"],
      },
      order: [
        ["userRoleId", "ASC"],
        ["createdAt", "DESC"],
      ],
      offset: offset ? offset : undefined,
      limit: limit ? limit : undefined,
    });

    if (result.length > 0) {
      response("User data", 200, res, result, metadata);
    } else {
      response("User data not found", 404, res);
    }
  } catch (error) {
    consoleError("Server Error", error);
    serverErrorResponse(error, res);
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  regenerateOtp,
  verifyLogin,
  getDetail,
  getData,
};
