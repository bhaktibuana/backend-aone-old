module.exports = {
  xAccessTokenCheck: require("./xAccessToken/xAccessToken.middleware"),
  isAuth: require("./authentication/authentication.middleware").isAuth,
  isAdmin: require("./authentication/authentication.middleware").isAdmin,
};
