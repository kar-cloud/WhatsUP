const { Room } = require("../schema/index");

const pushMessage = async (req) => {
  const message = req.body.message;
  const roomName = req.body.roomID.roomName;
  const room = await Room.findOne({ room: roomName });
  console.log("ROOM ==> ", room);
  if (room) {
    console.log(message);
    await Room.updateOne({ room: roomName }, { $push: { messages: message } });
  } else {
    await Room.create({ room: roomName });
    await Room.updateOne({ room: roomName }, { $push: { messages: message } });
  }
  return { success: "Message is pushed" };
};

const getRoomMessages = async (req) => {
  if (!req.isVerified) {
    return null;
  } else {
    const roomName = req.query.room;
    const data = await Room.findOne({ room: roomName });
    return data;
  }
};

module.exports = {
  pushMessage,
  getRoomMessages,
};
