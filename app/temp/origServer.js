const { Socket } = require("dgram");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const serviceNamespace = io.of("/admin");
const customerNamespace = io.of("/user");

app.get("/user", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/admin.html");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/username.html");
});

global.allUsers = [];
global.customerUsers = [];
global.serviceUsers = [];
var customerCount = 0;

io.on("connection", (socket) => {
  //console.log("a user has connected " + socket.id);
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });
  console.log(allUsers);

  socket.on("username", (data) => {
    console.log(data);
    allUsers.push({ id: socket.id, type: "customer", username: data });
    io.of("/admin").emit("userList", allUsers);
  });

  io.of("/admin").emit("userList", allUsers);

  socket.on("disconnect", () => {
    io.of("/admin").emit("userList", allUsers);
  });
});

serviceNamespace.on("connection", (socket) => {
  var servUsername = "Customer Support";
  var room = undefined;
  var customerSocket;
  allUsers.push({
    id: socket.id,
    type: "service",
    username: "Customer Support",
  });
  console.log("admin connected");
  console.log(allUsers);

  socket.on("adminUsername", (data) => {
    allUsers.splice(
      allUsers.findIndex((user) => user.id === socket.id),
      1
    );
    allUsers.push({ id: socket.id, type: "service", username: data });
    servUsername = data;
    console.log(allUsers);
    io.of("/admin").emit("userList", allUsers);
  });

  socket.on("disconnect", () => {
    allUsers.splice(
      allUsers.findIndex((user) => user.id === socket.id),
      1
    );
  });

  socket.on("joinRoom", (userID) => {
    console.log("admin joined room " + userID);
    socket.join(userID);
    room = userID;
    io.of("/user").sockets.forEach((socket) => {
      if (socket.id === userID) {
        customerSocket = socket;
      }
    });
    customerSocket.join(userID);
    socket.emit("success", "sucessefully joined room with user " + userID);
    customerSocket.emit(
      "success",
      "sucessefully joined room " + userID + " with admin" + socket.id
    );
    customerSocket.emit(
      "chat message",
      servUsername + ": Hello I am " + servUsername + ", how can I help?"
    );
  });

  socket.on("chat message", (msg) => {
    customerSocket.emit("chat message", servUsername + ": " + msg);
  });
});

customerNamespace.on("connection", (socket) => {
  var custUsername;
  for (let user of allUsers) {
    if (user["id"] === undefined && user["type"] === "customer") {
      user["id"] = socket.id;
      custUsername = user["username"];
      break;
    }
  }
  // allUsers.push({ id: socket.id, type: "customer" });
  customerCount++;
  console.log("customer connected " + socket.id);

  io.of("/admin").emit("customerCount", customerCount);
  io.of("/admin").emit("userList", allUsers);

  socket.emit(
    "chat message",
    "Server: Please wait while we get a support agent for you"
  );

  socket.on("chat message", (msg) => {
    socket.emit("chat message", custUsername + ": " + msg);
  });

  socket.on("disconnect", () => {
    allUsers.splice(
      allUsers.findIndex((user) => user.id === socket.id),
      1
    );
    customerCount--;
    console.log("customer disconnected");
    io.of("/admin").emit("userList", allUsers);
    io.of("/admin").emit("customerCount", customerCount);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// for creating rooms that admins and users can connect inside of
//  https://www.youtube.com/watch?v=bxUlKDgpbWs
