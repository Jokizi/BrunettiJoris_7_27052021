const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const commentsCtrl = require("../controllers/commentsCtrl");

router.post("/:messageId/comments/new/", auth, commentsCtrl.createComment);
module.exports = router;
