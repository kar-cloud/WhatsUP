require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8080;

var http = require("http").Server(app);
var io = require("socket.io")(http, {
  pingTimeout: 6000000,
  pingInterval: 30000,
});

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

const userDB = {mongoose.connection code}

const roomDB = {mongoose.connection code}

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

io.on("connection", (socket) => {
  console.log(socket.id + " ==== connected");
  socket.emit("your id", socket.id);

  socket.on("globalChat", () => {
    socket.join("global");
    socket.on("emitGlobalMessage", (data) => {
      const message = data;
      console.log(Array.from(socket.rooms));
      Array.from(socket.rooms)
        .filter((it) => it !== socket.id)
        .forEach((id) => {
          socket.to(id).emit("getGlobalMessage", message);
        });
    });
  });

  socket.on("join", (roomName) => {
    let split = roomName.split("--with--"); // ['username2', 'username1']

    let unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1)); // ['username1', 'username2']

    let updatedRoomName = `${unique[0]}--with--${unique[1]}`; // 'username1--with--username2'

    Array.from(socket.rooms)
      .filter((it) => it !== socket.id)
      .forEach((id) => {
        socket.leave(id);
        socket.removeAllListeners("emitMessage");
      });
    socket.join(updatedRoomName);
    socket.emit("your room", updatedRoomName);
    socket.on("emitMessage", (data) => {
      const message = data.body;
      const room = data.room;
      Array.from(socket.rooms)
        .filter((it) => it !== socket.id)
        .forEach((id) => {
          socket.to(id).emit("onMessage", message);
        });
    });
  });

  socket.on("forceDisconnect", function () {
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " ==== disconnected");
    socket.removeAllListeners();
  });
});

function auth(req, res, next) {
  try {
    const token = req.cookies.token;
    const usernameCookie = req.cookies.username;
    if (!token) {
      next();
    } else {
      req.isVerified = jwt.verify(token, process.env.JWT_SECRET);
      req.usernameCookie = usernameCookie;
      next();
    }
    // will return the user id of the verified user
  } catch (err) {
    console.log(err);
    res.status(401).json({ errorMessage: "You are Unauthorized" });
  }
}

app.post("/api/roomChat", async (req, res) => {
  const message = req.body.message;
  const room = req.body.roomID.roomName;
  console.log(message.body);
  if (await Room.findOne({ room: room })) {
    await Room.updateOne({ room: room }, { $push: { messages: message } });
  } else {
    await Room.create({ room: room });
    await Room.updateOne({ room: room }, { $push: { messages: message } });
  }
});

app.post("/api/roomChats", auth, async (req, res) => {
  if (!req.isVerified) {
    return null;
  } else {
    const roomName = req.body.roomName.room;
    await Room.findOne({ room: roomName })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.get("/api/globalChats", auth, async (req, res) => {
  if (!req.isVerified) {
    return null;
  } else {
    await Room.findOne({ room: "global" })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.post("/api/globalChats", auth, async (req, res) => {
  const message = req.body.globalMessage;
  console.log(message);
  if (await Room.findOne({ room: "global" })) {
    await Room.updateOne({ room: "global" }, { $push: { messages: message } });
  } else {
    await Room.create({ room: "global" });
    await Room.updateOne({ room: "global" }, { $push: { messages: message } });
  }
});

app.post("/api/register", (req, res) => {
  const userChatbox = req.body.userData;
  if (
    !userChatbox.username ||
    !userChatbox.password ||
    !userChatbox.confirmPassWord
  ) {
    return res.json({ fieldEmptyError: "Enter all the required fields" });
  }

  if (
    userChatbox.password.length < 8 ||
    userChatbox.confirmPassWord.length < 8
  ) {
    return res.json({
      passwordLengthError: "Password should be min 8 characters",
    });
  }

  if (userChatbox.username.length > 25) {
    return res.json({
      usernameLengthError: "Username can be max 25 characters",
    });
  }

  User.findOne({ username: userChatbox.username }, async (err, user) => {
    if (err) {
      console.log(err);
    }
    if (user) {
      res.json({ usernameError: "This username is already taken" });
    }
    if (!user) {
      if (userChatbox.password !== userChatbox.confirmPassWord) {
        res.json({ passwordError: "Passwords do not match" });
      } else {
        const hash = await bcrypt.hash(userChatbox.password, 10);
        const newUser = new User({
          username: userChatbox.username,
          password: hash,
        });
        const savedUser = await newUser.save();

        // signing a token
        const token = jwt.sign(
          {
            user: savedUser._id,
          },
          process.env.JWT_SECRET
        );

        // sending the token inside a cookie
        res
          .cookie("token", token, {
            httpOnly: true,
          })
          .cookie("username", savedUser.username, {
            httpOnly: true,
          })
          .json({ registrationVerified: "User is verified" })
          .send();
      }
    }
  });
});

app.post("/api/login", async (req, res) => {
  const userChatboxLogin = req.body.userLoginData;
  if (!userChatboxLogin.username || !userChatboxLogin.password) {
    return res.json({ fieldEmptyError: "Enter all the required fields" });
  }

  const foundUser = await User.findOne({ username: userChatboxLogin.username });
  if (!foundUser) {
    return res.json({
      verificationError: "Details cannot be verified..Try again",
    });
  }

  const checkPassword = await bcrypt.compare(
    userChatboxLogin.password,
    foundUser.password
  );

  if (!checkPassword) {
    return res.json({
      verificationError: "Details cannot be verified..Try again",
    });
  }

  // signing a token
  const token = jwt.sign(
    {
      user: foundUser._id,
    },
    process.env.JWT_SECRET
  );
  // sending the token inside a cookie
  res
    .cookie("token", token, {
      httpOnly: true,
    })
    .cookie("username", foundUser.username, {
      httpOnly: true,
    })
    .json({ loginVerified: "User is verified", userActive: foundUser.username })
    .send();
});

app.get("/api/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .cookie("username", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});

app.get("/api/home", auth, (req, res) => {
  if (!req.isVerified) {
    console.log("not authenticated from home page");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    // res.setHeader("Cache-Control", "no-cache, no-store");
    res.json({ unauthorizedMessage: "You are unauthorized" });
  } else {
    console.log("user is authenticated with the cookie");
    // res.setHeader("Cache-Control", "no-cache, no-store");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    res.json({ authorizedMessage: "You are authenticated from home page" });
  }
});

app.get("/api/chatroom", auth, (req, res) => {
  if (!req.isVerified) {
    console.log("not authenticated from chatroom page");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    // res.setHeader("Cache-Control", "no-cache, no-store");
    res.json({ unauthorizedMessage: "You are unauthorized" });
  } else {
    console.log("user is authenticated with the cookie from chatroom page");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    // res.setHeader("Cache-Control", "no-cache, no-store");
    res.json({
      authorizedMessage: "You are authenticated",
      username: req.usernameCookie,
    });
  }
});

app.post("/api/sendFriendRequest", auth, async (req, res) => {
  if (!req.isVerified) {
    return null;
  } else {
    const friendUsername = req.body.userContact.usernameContact;
    const foundFriend = await User.findOne({ username: friendUsername });
    if (!foundFriend) {
      return res.json({
        requestError: "Friend request cannot be send",
      });
    } else {
      await User.updateOne(
        { username: req.usernameCookie },
        { $push: { sendRequests: foundFriend.username } }
      );
      await User.updateOne(
        { username: foundFriend.username },
        { $push: { recievedRequests: req.usernameCookie } }
      );
      return res.json({
        requestSuccess: "Friend request has been sent",
      });
    }
  }
});

app.get("/api/myRequests", auth, async (req, res) => {
  if (!req.isVerified) {
    return null;
  } else {
    await User.findOne({ username: req.usernameCookie })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.post("/api/addFriend", auth, async (req, res) => {
  if (!req.isVerified) {
    return null;
  } else {
    const friend = req.body.friend.nowFriend;
    console.log(friend);
    await User.updateOne(
      { username: req.usernameCookie },
      {
        $pull: {
          recievedRequests: { $in: [friend] },
          sendRequests: { $in: [friend] },
        },
        $push: { friends: friend },
      }
    );
    await User.updateOne(
      { username: friend },
      {
        $pull: {
          sendRequests: { $in: [req.usernameCookie] },
          recievedRequests: { $in: [req.usernameCookie] },
        },
        $push: { friends: req.usernameCookie },
      }
    );
  }
});

app.post("/api/rejectFriend", auth, async (req, res) => {
  if (!req.isVerified) {
    return null;
  } else {
    const friend = req.body.friend.requestF;
    console.log(friend);
    await User.updateOne(
      { username: req.usernameCookie },
      {
        $pull: {
          recievedRequests: { $in: [friend] },
          sendRequests: { $in: [friend] },
        },
      }
    );
    await User.updateOne(
      { username: friend },
      {
        $pull: {
          sendRequests: { $in: [req.usernameCookie] },
          recievedRequests: { $in: [req.usernameCookie] },
        },
      }
    );
  }
});

app.post("/myContacts", auth, async (req, res) => {
  if (!req.isVerified) {
    return null;
  } else {
    const userContactData = req.body.userContact;
    await User.updateOne(
      { username: req.usernameCookie },
      { $push: { friends: userContactData.usernameContact } }
    );
  }
});

app.get("/api/myFriends", auth, async (req, res) => {
  if (!req.isVerified) {
    return null;
  } else {
    await User.findOne({ username: req.usernameCookie })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.get("/api/login", auth, (req, res) => {
  if (!req.isVerified) {
    console.log("not authenticated from login page");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    // res.setHeader("Cache-Control", "no-cache, no-store");
    res.json({ unauthorizedMessage: "You are unauthorized" });
  } else {
    console.log("user is authenticated with the cookie from login page");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    // res.setHeader("Cache-Control", "no-cache, no-store");
    res.json({ authorizedMessage: "You are authenticated " });
  }
});

app.get("/api/register", auth, (req, res) => {
  if (!req.isVerified) {
    console.log("not authenticated from register page");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    // res.setHeader("Cache-Control", "no-cache, no-store");
    res.json({ unauthorizedMessage: "You are unauthorized" });
  } else {
    console.log("user is authenticated with the cookie from register page");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    // res.setHeader("Cache-Control", "no-cache, no-store");
    res.json({ authorizedMessage: "You are authenticated" });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

http.listen(process.env.PORT || PORT, () => {
  console.log("Server is running on port 8080");
});
