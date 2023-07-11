require("dotenv").config();
const express = require("express");

const app = express();

// simple route
app.get("/", (req, res) => {
  res.json('Welcome to the SWEN 400 Real Time Messaging Project');
});


// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
