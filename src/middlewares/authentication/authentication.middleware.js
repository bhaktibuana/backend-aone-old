const jwt = require("jsonwebtoken");
const { config } = require("../../configs");
const { response } = require("../../utils");

const isAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    response("Unauthorized", 401, res);
  } else {
    const splitToken = req.headers.authorization.split(" ");

    if (splitToken.length !== 2 || splitToken[0] !== "Bearer") {
      response("Wrong authorization format", 400, res);
    } else {
      jwt.verify(
        splitToken[1],
        config.jwtSecretKey,
        { algorithms: ["HS256"] },
        (error, payload) => {
          if (error && error.name === "TokenExpiredError") {
            response("Unauthorized: Token expired", 401, res);
          } else if (error) {
            response("Unauthorized: Invalid token", 401, res);
          } else {
            res.locals.tokenPayload = payload;
            next();
          }
        }
      );
    }
  }
};

const isAdmin = (req, res, next) => {
  const { UserRole } = res.locals.tokenPayload;

  if (UserRole.code === "AD") {
    next();
  } else {
    response("Forbidden: only admin can access", 403, res);
  }
};

module.exports = {
  isAuth,
  isAdmin,
};
