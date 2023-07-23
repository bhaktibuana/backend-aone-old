const { File } = require("../../models");
const {
  response,
  serverErrorResponse,
  consoleError,
  parseDevice,
  files,
  generateMetadata,
} = require("../../utils");
const moment = require("moment");

const createData = async (req, res) => {
  const { device, uploadPayload } = res.locals;
  const { type } = req.query;
  const createdAt = moment().toDate();

  const payload = [];

  for (let i = 0; i < uploadPayload.count; i++) {
    payload.push({
      repository: uploadPayload.repository,
      category: uploadPayload.category[i],
      name: uploadPayload.name[i],
      createdAt,
      ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
      device: parseDevice(device),
      filePath: uploadPayload.filePath[i],
    });
  }

  try {
    if (payload.length > 0) {
      if (type === "single") {
        const result = await File.create(payload[0]);

        if (result) {
          response("Create data success", 201, res, {
            id: result.dataValues.id,
            fileUrl: `${req.protocol}://${
              req.headers.host
            }${files.targetFilePath(
              result.dataValues.repository,
              result.dataValues.category,
              result.dataValues.name
            )}`,
            createdAt: result.dataValues.createdAt,
          });
        } else {
          files.removeFile(payload[0].filePath);
          response("Create data failed", 400, res);
        }
      } else {
        const result = await File.bulkCreate(payload, {
          individualHooks: true,
        });

        if (result.length > 0) {
          const resultData = result.map(({ dataValues }) => ({
            id: dataValues.id,
            fileUrl: `${req.protocol}://${
              req.headers.host
            }${files.targetFilePath(
              dataValues.repository,
              dataValues.category,
              dataValues.name
            )}`,
            createdAt: dataValues.createdAt,
          }));
          response("Create data success", 201, res, resultData);
        } else {
          payload.forEach((item) => {
            files.removeFile(item.filePath);
          });
          response("Create data failed", 400, res);
        }
      }
    } else {
      response("Failed, choose at least one file", 400, res);
    }
  } catch (error) {
    consoleError("Server Error", error);
    serverErrorResponse(error, res);
  }
};

const getData = async (req, res) => {
  const { repoUuid } = res.locals;
  const { category } = req.query;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;

  const defaultWhere = {
    repository: repoUuid,
  };

  const where =
    category !== undefined
      ? category !== ""
        ? {
            repository: repoUuid,
            category,
          }
        : defaultWhere
      : defaultWhere;

  try {
    const count = await File.count({ where });
    const metadata = generateMetadata(req, count, offset, limit);
    const result = await File.findAll({
      where,
      order: [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],
      offset: offset ? offset : undefined,
      limit: limit ? limit : undefined,
    });

    if (result.length > 0) {
      const resultData = result.map(({ dataValues }) => {
        return {
          ...dataValues,
          fileUrl: `${req.protocol}://${req.headers.host}${files.targetFilePath(
            dataValues.repository,
            dataValues.category,
            dataValues.name
          )}`,
        };
      });
      response("File data", 200, res, resultData, metadata);
    } else {
      response("File not found", 404, res);
    }
  } catch (error) {
    consoleError("Server Error", error);
    serverErrorResponse(error, res);
  }
};

const deleteData = async (req, res) => {
  const { fileId, filePath } = res.locals;

  try {
    const result = await File.destroy({ where: { id: fileId } });
    if (result > 0) {
      files.removeFile(filePath);
      response("Delete file success", 200, res, result);
    } else {
      response("Delete file failed", 400, res);
    }
  } catch (error) {
    consoleError("Server Error", error);
    serverErrorResponse(error, res);
  }
};

module.exports = {
  createData,
  getData,
  deleteData,
};
