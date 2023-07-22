const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const { config } = require("../../configs");

const otpLength = 4;
const otpConfig = {
  lowerCaseAlphabets: false,
  upperCaseAlphabets: false,
  specialChars: false,
};

const generateOtpToken = (payload) => {
  return jwt.sign(payload, config.jwtSecretKey, {
    algorithm: "HS256",
    expiresIn: "120s",
  });
};

const generateOtp = () => {
  const otp = otpGenerator.generate(otpLength, otpConfig);
  const otpToken = generateOtpToken({ otp });
  return { otp, otpToken };
};

const verifyOtp = (otp, otpToken) => {
  let response = {};

  try {
    const verifyToken = jwt.verify(otpToken, config.jwtSecretKey, {
      algorithms: ["HS256"],
    });

    if (verifyToken.otp === otp) {
      response = {
        verified: true,
        message: "OTP verified",
      };
    } else {
      response = {
        verified: false,
        message: "Wrong OTP",
      };
    }
  } catch (error) {
    if (error && error.name === "TokenExpiredError") {
      response = {
        verified: false,
        message: "OTP expired",
      };
    } else if (error) {
      response = {
        verified: false,
        message: "Invalid token",
      };
    }
  }
  return response;
};

module.exports = {
  generateOtp,
  verifyOtp,
};
