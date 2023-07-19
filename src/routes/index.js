const { Router } = require("express");
const { response } = require("../utils");

const router = Router();

router.use("/", (req, res) => {
  const url = `${req.protocol}://${req.headers.host}`;
  response("Aone API", 200, res, { url });
});

module.exports = router;
