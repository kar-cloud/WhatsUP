const mongoose = require("mongoose");
const userDBPath = `mongodb+srv://${process.env.MONGODB_AUTH1}@cluster0.dth3gfm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const roomDBPath = `mongodb+srv://${process.env.MONGODB_AUTH2}@cluster0.czxk2z3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
