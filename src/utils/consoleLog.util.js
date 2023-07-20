const { config } = require("../configs");

const consoleLog = (title, payload) => {
  if (config.nodeEnv === "production") return;
  console.log(`[${title}] =>`, payload);
};

module.exports = consoleLog;
