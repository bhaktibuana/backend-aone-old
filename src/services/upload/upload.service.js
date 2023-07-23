const multer = require("multer");
const path = require("path");
const { files } = require("../../utils");
const { generateFileName, targetFilePath, uploadFilePath } = files;

const single = (repoUuid) => {
  const categoryTemp = [];
  const nameTemp = [];
  const filePathTemp = [];
  const fileExtTemp = [];

  const payload = {
    repository: repoUuid,
    category: categoryTemp,
    name: nameTemp,
    filePath: filePathTemp,
    fileExt: fileExtTemp,
    count: 0,
  };

  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, uploadFilePath(repoUuid, file.mimetype.split("/")[0]));
    },
    filename: (req, file, callback) => {
      const newFileName = generateFileName(file.originalname);

      categoryTemp.push(file.mimetype.split("/")[0]);
      nameTemp.push(newFileName);
      filePathTemp.push(
        targetFilePath(repoUuid, file.mimetype.split("/")[0], newFileName)
      );
      fileExtTemp.push(path.extname(file.originalname));

      payload.category = categoryTemp;
      payload.name = nameTemp;
      payload.filePath = filePathTemp;
      payload.fileExt = fileExtTemp;
      payload.count = payload.count + 1;

      callback(null, newFileName);
    },
  });

  const upload = multer({ storage }).single("singleFile");
  return { upload, payload };
};

const multiple = (repoUuid) => {
  const categoryTemp = [];
  const nameTemp = [];
  const filePathTemp = [];
  const fileExtTemp = [];

  const payload = {
    repository: repoUuid,
    category: categoryTemp,
    name: nameTemp,
    filePath: filePathTemp,
    fileExt: fileExtTemp,
    count: 0,
  };

  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, uploadFilePath(repoUuid, file.mimetype.split("/")[0]));
    },
    filename: (req, file, callback) => {
      const newFileName = generateFileName(file.originalname);

      categoryTemp.push(file.mimetype.split("/")[0]);
      nameTemp.push(newFileName);
      filePathTemp.push(
        targetFilePath(repoUuid, file.mimetype.split("/")[0], newFileName)
      );
      fileExtTemp.push(path.extname(file.originalname));

      payload.category = categoryTemp;
      payload.name = nameTemp;
      payload.filePath = filePathTemp;
      payload.fileExt = fileExtTemp;
      payload.count = payload.count + 1;

      callback(null, newFileName);
    },
  });

  const upload = multer({ storage }).array("multipleFile");
  return { upload, payload };
};

module.exports = {
  single,
  multiple,
};
