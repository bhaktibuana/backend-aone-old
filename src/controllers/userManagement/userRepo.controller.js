const { UserRepo } = require("../../models");
const { response, serverErrorResponse, consoleLog } = require("../../utils");

const getDetail = async (req, res) => {
  const { tokenPayload } = res.locals;

  try {
    const result = await UserRepo.findOne({
      where: { userId: tokenPayload.id },
    });
    if (result) {
      response("User repository data", 200, res, result);
    } else {
      response("User repository data not found", 404, res);
    }
  } catch (error) {
    consoleLog("Server Error", error);
    serverErrorResponse(error, res);
  }
};

module.exports = {
  getDetail,
};
