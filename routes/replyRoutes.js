const express = require("express");
const router = express.Router();
const replyController = require("../controllers/replyController");

router.get("/", replyController.getAllReplies);
// router.post("/", replyController.createReply);

module.exports = router;