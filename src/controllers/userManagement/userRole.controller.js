const { UserRole } = require("../../models");
const { response, serverErrorResponse, consoleError } = require("../../utils");

const getData = async (req, res) => {
  try {
    const result = await UserRole.findAll();
    if (result.length) {
      response("User role data", 200, res, result);
    } else {
      response("User role data not found", 404, res);
    }
  } catch (error) {
    consoleError("Server Error", error);
    serverErrorResponse(error, res);
  }
};

module.exports = {
  getData,
};
