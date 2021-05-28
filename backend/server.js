// Imports
let express = require("express");

// Instantiate server
let server = express();

// Configure routes
server.get("/", function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send("<h1>Bonjour sur mon server</h1>");
});

// Launch server
server.listen(8080, function () {
  console.log("-----------------Launch server-------------------");
  console.log("Server en écoute");
  console.log("------------------------------------");
});
