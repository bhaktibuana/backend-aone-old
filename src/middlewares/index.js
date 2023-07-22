module.exports = {
  deviceDetector: require("./deviceDetector/deviceDetector.middleware"),
  xAccessTokenCheck: require("./xAccessToken/xAccessToken.middleware"),
  isAuth: require("./authentication/authentication.middleware").isAuth,
  isAdmin: require("./authentication/authentication.middleware").isAdmin,
  userMiddleware: require("./userManagement/user.middleware"),
};
