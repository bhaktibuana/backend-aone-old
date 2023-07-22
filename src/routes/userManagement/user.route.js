const { Router } = require("express");
const { isAuth, isAdmin, userMiddleware } = require("../../middlewares");
const { userController } = require("../../controllers");

const router = Router();

router.post(
  "/register",
  userMiddleware.checkEmailExist,
  userMiddleware.checkUsernameExist,
  userMiddleware.getUserRoleData,
  userController.register
);

router.post("/verifyEmail", userController.verifyEmail);
router.post("/login", userController.login);
router.post("/regenerateOtp", userController.regenerateOtp);
router.post("/verifyLogin", userController.verifyLogin);
router.get("/getDetail", isAuth, userController.getDetail);
router.get("/", isAuth, isAdmin, userController.getData);

module.exports = router;
