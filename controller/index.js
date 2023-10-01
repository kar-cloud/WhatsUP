const {
  registerUser,
  loginUser,
  logoutUser,
  checkAuthenticatedUser,
} = require("./auth");
const { pushMessage, getRoomMessages } = require("./chat");
const {
  sendFriendRequest,
  getUserData,
  addFriend,
  rejectFriend,
} = require("./friend");

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  pushMessage,
  getRoomMessages,
  checkAuthenticatedUser,
  sendFriendRequest,
  getUserData,
  addFriend,
  rejectFriend,
};
