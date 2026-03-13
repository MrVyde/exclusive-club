const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");

router.get("/new", usersController.getSignup);
router.post("/submit", usersController.validateSignup, usersController.postsignup);
router.get("/login", usersController.getLogin);
router.post("/login",  usersController.validateLogin, usersController.postlogin);
router.post("/join", usersController.joinClub);

module.exports = router;