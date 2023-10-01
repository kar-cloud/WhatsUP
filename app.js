require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { apiRouter } = require("./route/index.js");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use("/api", apiRouter);

module.exports = { app };
