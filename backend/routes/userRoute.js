const express = require("express");
const router = express.Router();
const usersCtrl = require("../controllers/usersCtrl");
const auth = require("../middlewares/auth");

// Users routes
router.post("/users/registrer/", usersCtrl.registrer);
router.post("/users/login/", usersCtrl.login);
module.exports = router;
