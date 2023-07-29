const { config } = require("../../configs");
const { response } = require("../../utils");

const xAccessTokenCheck = (req, res, next) => {
  if (req.path.split("/")[1] === "file") {
    next();
    return;
  }

  if (req.headers["x-access-token"] === undefined) {
    response("Forbidden", 403, res);
  } else if (req.headers["x-access-token"] !== config.xAccessToken) {
    response("Invalid x-access-token", 403, res);
  } else {
    next();
  }
};

module.exports = xAccessTokenCheck;
