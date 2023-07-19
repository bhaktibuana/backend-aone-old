const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const router = require("./routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));
app.use("/", router);

module.exports = app;
