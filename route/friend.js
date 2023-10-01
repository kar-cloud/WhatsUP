const express = require("express");
const friendRouter = express.Router();
const auth = require("../middleware/index");
const {
  sendFriendRequest,
  getUserData,
  addFriend,
  rejectFriend,
} = require("../controller/index");

friendRouter.post("/sendRequest", auth, sendFriendRequest);
friendRouter.get("/user", auth, getUserData);
friendRouter.post("/add", auth, addFriend);
friendRouter.post("/reject", auth, rejectFriend);

module.exports = friendRouter;
