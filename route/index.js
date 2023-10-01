const express = require("express");
const apiRouter = express.Router();

apiRouter.use("/auth", require("./auth"));
apiRouter.use("/chat", require("./chat"));
apiRouter.use("/friend", require("./friend"));

module.exports = {
  apiRouter,
};
