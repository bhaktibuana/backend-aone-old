const { Router } = require("express");
const { isAuth } = require("../../middlewares");
const { userRepoController } = require("../../controllers");

const router = Router();

router.get("/getDetail", isAuth, userRepoController.getDetail);

module.exports = router;
