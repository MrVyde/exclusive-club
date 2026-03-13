require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./pool');
const bcrypt = require("bcryptjs");
const flash = require('connect-flash');



const app = express(); // ← create the app FIRST

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// Tell Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Creates session storage.
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));



//Allows Passport to read session data & initialize passport.
app.use(passport.initialize());
app.use(passport.session());

// parse the incoming data and put it into req.body.”
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(flash());
// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  next();
});
//This ensures that res.locals.currentUser is available in all views.
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//setting up the LocalStrategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // tells passport to expect email instead of username
    async (email, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect Email" });
      }

      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return done(null, false, { message: "Incorrect Password" })
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

//store user info in the session & load the user from the DB
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});










// Route
const Message = require('./models/postsModel');

app.get('/', async (req, res) => {
  try {
    let messages;
    if (req.user && req.user.is_member) {
      messages = await Message.getMessagesForMembers();
    } else {
      messages = await Message.getMessagesForNonMembers();
    }

    res.render('index', { messages});
  } catch (err) {
    console.error(err);
    res.send("Error loading messages");
  }
});

const userRouter = require("./routes/userRouter");
app.use("/users", userRouter);

const postRouter = require("./routes/postsRouter");
app.use("/posts", postRouter);



// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port  http://localhost:${PORT}`);
});