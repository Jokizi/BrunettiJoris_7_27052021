const express = require("express");
const messagesCtrl = require("../controllers/messagesCtrl");
const router = express.Router();
const auth = require("../middlewares/auth");

router.post("/messages/new/", auth, messagesCtrl.createMessage);
router.get("/messages/", auth, messagesCtrl.listMessages);
module.exports = router;
