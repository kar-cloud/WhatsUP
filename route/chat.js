const express = require("express");
const chatRouter = express.Router();
const auth = require("../middleware/index");
const { pushMessage, getRoomMessages } = require("../controller/index");

chatRouter.post("/message", pushMessage);
chatRouter.get("/room/messages", auth, getRoomMessages);

module.exports = chatRouter;
