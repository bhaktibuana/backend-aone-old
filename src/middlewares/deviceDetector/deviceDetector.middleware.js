const DeviceDetector = require("device-detector-js");
const { response } = require("../../utils");

const deviceDetector = (req, res, next) => {
  const userAgent = req.headers["user-agent"];
  const detector = new DeviceDetector();
  const device = detector.parse(userAgent);

  if (device.bot !== null) {
    response("Bot detected!", 451, res, { device });
  } else {
    res.locals.device = device;
    next();
  }
};

module.exports = deviceDetector;
