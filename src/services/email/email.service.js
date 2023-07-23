const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");
const { config } = require("../../configs");
const { consoleLog, consoleError } = require("../../utils");

const viewPath = path.join(process.cwd(), "./src/views");

const transport = nodemailer.createTransport({
  port: parseInt(config.smtpPort),
  host: config.smtpHost,
  auth: {
    user: config.smtpUsername,
    pass: config.smtpPassword,
  },
  secure: true,
});

const mailOptions = (subject, html, recipient) => {
  return {
    from: `Aone <${config.smtpUsername}>`,
    ...recipient,
    subject,
    text: "",
    html,
  };
};

const readHTMLFile = (path, callback) => {
  fs.readFile(path, { encoding: "utf-8" }, (error, html) => {
    if (error) {
      callback(error);
    } else {
      callback(null, html);
    }
  });
};

const sendEmail = (subject, htmlName, context, recipient) => {
  readHTMLFile(`${viewPath}/${htmlName}.html`, (error, html) => {
    if (error) {
      consoleError("Render View Error", error);
      return;
    }

    const template = handlebars.compile(html);
    const htmlResult = template(context);

    transport.sendMail(
      mailOptions(subject, htmlResult, recipient),
      (error, response) => {
        if (error) {
          consoleError("SMTP Error", error);
        } else {
          consoleLog("SMTP Success", response);
        }
      }
    );
  });
};

module.exports = {
  sendEmail,
};
