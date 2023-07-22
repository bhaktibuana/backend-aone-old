const { User, UserRole } = require("../../models");
const { response, serverErrorResponse } = require("../../utils");

const checkEmailExist = async (req, res, next) => {
  const { email } = req.body;
  try {
    const result = await User.count({ where: { email } });
    if (result > 0) {
      response("Email already exist", 400, res);
    } else {
      next();
    }
  } catch (error) {
    serverErrorResponse(error, res);
  }
};

const checkUsernameExist = async (req, res, next) => {
  const { username } = req.body;
  try {
    const result = await User.count({ where: { username } });
    if (result > 0) {
      response("Username already exist", 400, res);
    } else {
      next();
    }
  } catch (error) {
    serverErrorResponse(error, res);
  }
};

const getUserRoleData = async (req, res, next) => {
  try {
    const result = await UserRole.findAll();
    if (result.length > 0) {
      res.locals.userRoleList = result.map(({ dataValues }) => dataValues);
      next();
    } else {
      response("User role data not found", 404, res);
    }
  } catch (error) {
    serverErrorResponse(error, res);
  }
};

module.exports = {
  checkEmailExist,
  checkUsernameExist,
  getUserRoleData,
};
