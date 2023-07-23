const path = require("path");
const fs = require("fs");
const moment = require("moment");
const crypto = require("crypto")

const targetFilePath = (repoUuid, fileType, fileName) => {
  const filePath = path
    .join(`./${repoUuid}/${fileType}`, `./${fileName}`)
    .split("\\")
    .join("/");
  return `/${filePath}`;
};

const uploadFilePath = (repoUuid, fileType) => {
  const appDir = process.cwd();
  const baseDir = path.join(appDir, `./public`);
  const repoDir = path.join(baseDir, `./${repoUuid}`);
  const fileDir = path.join(repoDir, `./${fileType}`);

  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);
  if (!fs.existsSync(repoDir)) fs.mkdirSync(repoDir);
  if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir);

  return fileDir;
};

const generateFileName = (fileName) => {
  const date = moment().format("YYYYMMDD").toString();
  const time = moment().format("HHmmss").toString();
  const newFileName = fileName.replace(/[^0-9a-zA-Z]/g, "_");
  const fileNameObj = splitFileName(newFileName);

  const hashLength = 6;
  const randomhash = crypto
    .randomBytes(Math.ceil(hashLength / 2))
    .toString("hex")
    .slice(0, hashLength);

  return `${date}-${time}-${randomhash}-${fileNameObj.fileName}.${fileNameObj.fileType}`;
};

const splitFileName = (fileName) => {
  const fileNameArr = fileName.split("_");
  const fileType = fileNameArr[fileNameArr.length - 1].toLowerCase();
  fileNameArr.pop();

  return {
    fileName: fileNameArr.join("_"),
    fileType,
  };
};

const removeFile = (filePath) => {
  const appDir = process.cwd();
  const targetPath = path.join(`${appDir}/public`, filePath);

  fs.unlink(targetPath, (error) => {
    if (error) {
      return;
    }
    return;
  });
};

module.exports = {
  targetFilePath,
  uploadFilePath,
  generateFileName,
  removeFile,
};
