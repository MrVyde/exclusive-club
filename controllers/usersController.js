const User = require('../models/usersModel');
const passport = require("passport");
const { body, validationResult } = require("express-validator");


//validation rules
const validateSignup = [
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name is required")
    .escape(),

  body("lastName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name is required")
    .escape(),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
];

const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
];



async function getSignup(req, res) {
  res.render("users/signup", { errors: [], oldInput: {} });
}

async function postsignup(req, res) {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("users/signup", {
        errors: errors.array(),
        oldInput: req.body
      });
    }

    const { firstName, lastName, email, password } = req.body;

    await User.createUser({ firstName, lastName, email, password });

    res.redirect("/users/login");

  } catch (err) {
    console.error(err);
    res.send("Error signing up");
  }
}

async function getLogin(req, res) {
  res.render("users/login", { errors: [], oldInput: {} }); 
}

async function postlogin(req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("users/login", {
      errors: errors.array(),
      flashErrors: req.flash('error'),
      oldInput: req.body 
    });
  }

passport.authenticate("local", (err, user, info) => {
  if (err) return next(err);

    if (!user) {
      return res.render("users/login", {
        errors: [{ msg: info.message }],
        oldInput: req.body
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
})(req, res, next);
}

async function joinClub(req, res) {
  try {
    const { passcode } = req.body;
    const SECRET = process.env.MEMBER_PASSCODE;

    if (!req.user) {
      return res.json({
        success: false,
        message: "You must be logged in first."
      });
    }
    
    if (passcode === SECRET) {
      await User.updateMembership(req.user.id, true);
      return res.json({ success: true, message: "Welcome to the club!" });
    } else {
      return res.json({ success: false, message: "Incorrect passcode" });
    }
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Something went wrong. Please try again." });
  }
}

module.exports = {
  getSignup,
  postsignup,
  getLogin,
  postlogin,
  joinClub,
  validateSignup,
  validateLogin
};