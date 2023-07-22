const crypto = require("crypto");

const hashPassword = (password) => {
  const salt = "2d7e3ba5";
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
};

/* UNCOMMENT CODE BELLOW TO GENERATE SALT */

// const consoleLog = require("./consoleLog.util");
// const generateSalt = () => {
//   const saltLength = 8;
//   const salt = crypto
//     .randomBytes(Math.ceil(saltLength / 2))
//     .toString("hex")
//     .slice(0, saltLength);

//   return salt;
// };
// consoleLog("Password Salt", generateSalt());

module.exports = hashPassword;
