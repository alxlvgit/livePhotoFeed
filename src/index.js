const http = require("http");
const handler = require("./handler.js");
const socket = require("socket.io");
const database = require("../database/data.json")

const PORT = process.env.PORT || 3000;

const server = http
  .createServer(handler)
server.listen(PORT, () => console.log(`server is running at  ${PORT}`));

const io = socket(server);

io.on("connection", function (socket) {
  console.log("connected");

  socket.once("feed open", () => {
    socket.emit("get all photos", database);
  });

  socket.on("upload new image to feed", () => {
    io.emit("add one photo", database);
  });

  socket.on("one photo added", () => {
    io.emit("alert", "");
  });

  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});




