const { app } = require("./app");
const port = process.env.PORT || 8080;
var http = require("http").Server(app);

var io = require("socket.io")(http, {
  pingTimeout: 6000000,
  pingInterval: 30000,
});

io.on("connection", (socket) => {
  console.log(socket.id + " ==== connected");
  socket.emit("your id", socket.id);

  socket.on("globalChat", () => {
    socket.join("global");
    socket.on("emitGlobalMessage", (data) => {
      const message = data;
      console.log(socket.rooms);
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

    console.log(updatedRoomName);
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

http.listen(port, () => {
  console.log(`
    #####################################################
        Started Server ⚡️ In [${process.env.NODE_ENV}]  Mode
        Port Number : ${port}
    ######################################################
        `);
});
