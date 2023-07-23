const { Router } = require("express");
const router = Router();

/* [START ROUTING] */
router.use("/userRole", require("../userManagement/userRole.route"));
router.use("/user", require("../userManagement/user.route"));
router.use("/userRepo", require("../userManagement/userRepo.route"));
router.use("/file", require("../fileManagement/file.route"));
/* [END ROUTING] */

module.exports = router;
