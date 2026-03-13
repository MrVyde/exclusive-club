const express = require("express");
const router = express.Router();

const postsController = require("../controllers/postsController");
const auth = require("../middleware/auth");

router.get("/new", postsController.createMessageget);
router.post("/submit", postsController.validatePost, postsController.createMessagepost);
router.get("/", postsController.viewMessagesget);
router.post("/delete/:id", auth.ensureAdmin, postsController.deleteMessagePost);

module.exports = router;