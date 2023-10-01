const friendServices = require("../services/friend");

const sendFriendRequest = async (req, res) => {
  const response = await friendServices.sendFriendRequest(req);
  return res.json(response);
};

const getUserData = async (req, res) => {
  const response = await friendServices.getUserData(req);
  return res.json(response);
};

const addFriend = async (req, res) => {
  const response = await friendServices.addFriend(req);
  return res.json(response);
};

const rejectFriend = async (req, res) => {
  const response = await friendServices.rejectFriend(req);
  return res.json(response);
};

module.exports = {
  sendFriendRequest,
  getUserData,
  addFriend,
  rejectFriend,
};
