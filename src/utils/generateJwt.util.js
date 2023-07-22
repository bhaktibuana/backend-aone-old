const jwt = require("jsonwebtoken");
const { config } = require("../configs");

const generateJwt = (payload, useExpires = true) => {
  return useExpires
    ? jwt.sign(payload, config.jwtSecretKey, {
        algorithm: "HS256",
        expiresIn: config.jwtExpiredTime,
      })
    : jwt.sign(payload, config.jwtSecretKey, { algorithm: "HS256" });
};

module.exports = generateJwt;
