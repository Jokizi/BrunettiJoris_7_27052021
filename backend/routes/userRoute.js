const express = require("express");
const router = express.Router();
const usersCtrl = require("../controllers/usersCtrl");
const auth = require("../middlewares/auth");

// Users routes
router.post("/users/registrer/", usersCtrl.registrer);
router.post("/users/login/", usersCtrl.login);
router.get("/users/profile/", auth, usersCtrl.getUserProfile);
router.put("/users/profile/", auth, usersCtrl.updateUserProfile);
module.exports = router;
