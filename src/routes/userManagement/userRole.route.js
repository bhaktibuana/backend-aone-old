const { Router } = require("express");
const { isAuth, isAdmin } = require("../../middlewares");
const { userRoleController } = require("../../controllers");

const router = Router();

router.get("/", isAuth, isAdmin, userRoleController.getData);

module.exports = router;
