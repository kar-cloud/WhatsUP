const chatServices = require("../services/chat");

const pushMessage = async (req, res) => {
  const response = await chatServices.pushMessage(req);
  return res.json(response);
};

const getRoomMessages = async (req, res) => {
  const response = await chatServices.getRoomMessages(req);
  return res.json(response);
};

module.exports = {
  pushMessage,
  getRoomMessages,
};
