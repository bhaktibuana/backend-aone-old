const { User, UserRepo, File } = require("../../models");
const {
  response,
  serverErrorResponse,
  consoleLog,
  files,
} = require("../../utils");
const { uploadService } = require("../../services");
const { config } = require("../../configs");
const jwt = require("jsonwebtoken");

const checkApiKeyActive = async (req, res, next) => {
  const { key } = req.query;

  if (key === undefined || key === "") {
    response("API KEY is required", 400, res);
    return;
  }

  try {
    const result = await User.findOne({
      include: [
        {
          model: UserRepo,
          required: true,
          where: { apiKey: key },
        },
      ],
      attributes: {
        exclude: ["password"],
      },
    });

    if (result) {
      if (result.inactive === false) {
        const verifyApiKey = jwt.verify(key, config.jwtSecretKey, {
          algorithms: ["HS256"],
        });
        res.locals.repoUuid = verifyApiKey.uuid;
        next();
      } else {
        response("Inactive API KEY", 400, res);
      }
    } else {
      response("Invalid API KEY", 400, res);
    }
  } catch (error) {
    consoleLog("Server Error", error);
    serverErrorResponse(error, res);
  }
};

const checkType = (req, res, next) => {
  const { type } = req.query;
  if (!(type === "single" || type === "multiple")) {
    response("Type must be single or multiple", 400, res);
    return;
  }
  next();
};

const uploadSingleFile = (req, res, next) => {
  const { type } = req.query;
  const { repoUuid } = res.locals;

  if (type !== "single") {
    next();
    return;
  }

  try {
    const { payload, upload } = uploadService.single(repoUuid);
    res.locals.uploadPayload = payload;

    upload(req, res, (error) => {
      if (!error) {
        next();
      } else {
        response("Upload file failed", 400, res, error);
      }
    });
  } catch (error) {
    consoleLog("Server Error", error);
    serverErrorResponse(error, res);
  }
};

const uploadMultipleFile = (req, res, next) => {
  const { type } = req.query;
  const { repoUuid } = res.locals;

  if (type !== "multiple") {
    next();
    return;
  }

  try {
    const { payload, upload } = uploadService.multiple(repoUuid);
    res.locals.uploadPayload = payload;

    upload(req, res, (error) => {
      if (!error) {
        next();
      } else {
        response("Upload file failed", 400, res, error);
      }
    });
  } catch (error) {
    consoleLog("Server Error", error);
    serverErrorResponse(error, res);
  }
};

const fileFilter = (req, res, next) => {
  const { uploadPayload } = res.locals;
  const { filter } = req.query;

  const fileFilter =
    filter !== undefined
      ? filter !== ""
        ? filter
            .toLowerCase()
            .split(",")
            .map((item) => `.${item}`)
        : []
      : [];

  const unique = (array) => {
    return Array.from(new Set(array));
  };

  if (fileFilter.length > 0) {
    const unexpectedExt = uploadPayload.fileExt.filter(
      (item) => !fileFilter.includes(item)
    );

    if (unexpectedExt.length > 0) {
      uploadPayload.filePath.forEach((item) => {
        files.removeFile(item);
      });

      response(
        `File(s) with extension ${unique(unexpectedExt).join(
          " or "
        )} not allowed`,
        400,
        res
      );
    } else {
      next();
    }
  } else {
    next();
  }
};

const checkDataExist = async (req, res, next) => {
  const { category, name } = req.query;
  const { repoUuid } = res.locals;

  try {
    const result = await File.findOne({
      where: { repository: repoUuid, category, name },
    });

    if (result) {
      res.locals.fileId = result.dataValues.id;
      res.locals.filePath = files.targetFilePath(
        result.dataValues.repository,
        result.dataValues.category,
        result.dataValues.name
      );
      next();
    } else {
      response("Selected data doesn't exist", 400, res);
    }
  } catch (error) {
    consoleLog("Server Error", error);
    serverErrorResponse(error, res);
  }
};

module.exports = {
  checkApiKeyActive,
  checkType,
  uploadSingleFile,
  uploadMultipleFile,
  fileFilter,
  checkDataExist,
};
