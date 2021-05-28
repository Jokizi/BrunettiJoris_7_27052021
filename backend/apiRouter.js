// Imports
const express = require("express");
const usersCtrl = require("./routes/usersCtrl");

// Router
exports.router = (function () {
  let apiRouter = express.Router();

  // Users routes
  apiRouter.route("/users/registrer/").post(usersCtrl.registrer);
  apiRouter.route("/users/login/").post(usersCtrl.login);

  return apiRouter;
})();
