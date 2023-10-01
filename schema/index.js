const mongoose = require("mongoose");
const userDBPath = `mongodb+srv://${process.env.MONGODB_AUTH1}@cluster0.5rsnb.mongodb.net/userDB?retryWrites=true&w=majority`;
const roomDBPath = `mongodb+srv://${process.env.MONGODB_AUTH2}@cluster0.7kkhg.mongodb.net/roomDB?retryWrites=true&w=majority`;

const userDB = mongoose.createConnection(userDBPath, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const roomDB = mongoose.createConnection(roomDBPath, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  sendRequests: [mongoose.Schema.Types.Mixed],
  recievedRequests: [mongoose.Schema.Types.Mixed],
  friends: [mongoose.Schema.Types.Mixed],
});

const roomSchema = new mongoose.Schema({
  room: String,
  messages: [mongoose.Schema.Types.Mixed],
});

const User = userDB.model("User", userSchema);
const Room = roomDB.model("Room", roomSchema);

module.exports = {
  User,
  Room,
};
