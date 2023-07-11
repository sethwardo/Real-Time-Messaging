// Setting everything needed for Socket to run
const { Socket } = require("dgram");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// defining namespace that the admin use
const serviceNamespace = io.of("/admin");

// pointing links to the html files they correspond to
/*
app.get("/user", (req, res) => {
    res.sendFile(__dirname + "/client/index.html");
  });
*/
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/admin.html");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/username.html");
});

// defining global variables for tracking users
global.allUsers = [];
global.customerUsers = [];
global.serviceUsers = [];
var customerCount = 0;

// handling whenever any type of socket connects
io.on("connection", (socket) => {
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });
  customerCount++;
  var custUsername = "Customer" + Math.floor(Math.random() * 999);
  var adminSocket;

  // Adding the user to our list of users with a random username
  allUsers.push({
    id: socket.id,
    type: "customer",
    username: custUsername,
  });

  // sending the list of users to the admin
  io.of("/admin").emit("userList", allUsers);
  io.of("/admin").emit("customerCount", customerCount);

  // Changing the username of the user to the one they chose
  socket.on("username", (data) => {
    if (data != "") {
      allUsers.splice(
        allUsers.findIndex((user) => user.id === socket.id),
        1
      );
      allUsers.push({ id: socket.id, type: "customer", username: data });
      custUsername = data;
    }
    io.of("/admin").emit("userList", allUsers);
  });

  // handling disconnects
  socket.on("disconnect", () => {
    allUsers.splice(
      allUsers.findIndex((user) => user.id === socket.id),
      1
    );
    customerCount--;
    io.of("/admin").emit("userList", allUsers);
    io.of("/admin").emit("customerCount", customerCount);
  });

  // letting the user know they are connected
  socket.emit(
    "chat message",
    "Server: Please wait while we get a support agent for you"
  );

  // getting admin socket
  socket.on("pass", (data) => {
    adminSocket = io.of("/admin").sockets.get(data);
  });

  // handling when the user sends a message
  socket.on("chat message", (msg) => {
    if (adminSocket) {
      adminSocket.emit("chat message", custUsername + ": " + msg);
    }
    socket.emit("chat message", custUsername + ": " + msg);
  });
});

// setting up the admin namespace
serviceNamespace.on("connection", (socket) => {
  // giving a default username to the admin
  var servUsername = "Customer Support";

  var room = undefined;
  var customerSocket;

  // adding the admin to the list of users
  allUsers.push({
    id: socket.id,
    type: "service",
    username: "Customer Support",
  });

  io.of("/admin").emit("userList", allUsers);

  // handling when the admin changes their username
  socket.on("adminUsername", (data) => {
    allUsers.splice(
      allUsers.findIndex((user) => user.id === socket.id),
      1
    );
    allUsers.push({ id: socket.id, type: "service", username: data });
    servUsername = data;
    io.of("/admin").emit("userList", allUsers);
  });

  // handling admin disconnect
  socket.on("disconnect", () => {
    allUsers.splice(
      allUsers.findIndex((user) => user.id === socket.id),
      1
    );
    io.of("/admin").emit("userList", allUsers);
  });

  // handling when the admin joins a room
  socket.on("joinRoom", (userID) => {
    // sending message to clear the previous chat
    socket.emit("joinedRoom", "");
    // setting the room variable to the room the admin is in
    room = "room:" + userID;
    // joining the room with the admin socket
    socket.join(room);
    // finding the customer socket to connect to
    customerSocket = io.sockets.sockets.get(userID);
    // joining the room with the customer socket
    if (customerSocket) {
      customerSocket.join(room);
    } else {
      console.log("customer socket not found");
    }
    // sending success messages to admin and customer
    socket.emit("success", "successfully joined room with user " + userID);
    customerSocket.emit(
      "success",
      "successfully joined room " + room + "with admin " + servUsername
    );

    // passing the admin socket to the customer socket
    customerSocket.emit("connected", socket.id);
    // sending a chat message to show the admin has joined
    customerSocket.emit(
      "chat message",
      servUsername + ": Hello, I am " + servUsername + ". How can I help you?"
    );
    socket.emit(
      "chat message",
      servUsername + ": Hello, I am " + servUsername + ". How can I help you?"
    );
  });

  // handling when the admin sends a message
  try {
    socket.on("chat message", (msg) => {
      if (customerSocket) {
        customerSocket.emit("chat message", servUsername + ": " + msg);
        socket.emit("chat message", servUsername + ": " + msg);
      } else {
        socket.emit("error", "customer socket undefined");
      }
    });
  } catch (e) {
    console.log(
      "error, customer probably left which makes the room no longer valid"
    );
    console.log(e);
  }
});

// opening port for server to listen on
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
