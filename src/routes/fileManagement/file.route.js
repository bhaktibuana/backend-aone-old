const { Router } = require("express");
const { fileMiddleware } = require("../../middlewares");
const { fileController } = require("../../controllers");

const router = Router();

router.post(
  "/",
  fileMiddleware.checkApiKeyActive,
  fileMiddleware.checkType,
  fileMiddleware.uploadSingleFile,
  fileMiddleware.uploadMultipleFile,
  fileMiddleware.fileFilter,
  fileController.createData
);

router.get("/", fileMiddleware.checkApiKeyActive, fileController.getData);

router.delete(
  "/",
  fileMiddleware.checkApiKeyActive,
  fileMiddleware.checkDataExist,
  fileController.deleteData
);

module.exports = router;
