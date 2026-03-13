const Message = require('../models/postsModel');
const { body, validationResult } = require("express-validator");

//validation rules
const validatePost = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters")
    .escape(),

  body("text")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Text cannot be empty")
    .isLength({ max: 2000 })
    .withMessage("Text cannot exceed 2000 characters")
    .escape()
];


async function createMessageget(req, res) {
  res.render("posts/createpost", { errors: [], data: {} });
}

async function createMessagepost(req, res) {
  try {
    if (!req.user) {
      return res.redirect("/users/login");
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Pass errors to the form
      return res.render("posts/createpost", {
        errors: errors.array(),
        data: req.body
      });
    }

    const { title, text } = req.body;
    await Message.createMessage({ userId: req.user.id, title, text });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send("Error creating message");
  }
}

async function viewMessagesget(req, res) {
  try {
    let messages;
    if (req.session.user && req.session.user.is_member) {
      messages = await Message.getMessagesForMembers();
    } else {
      messages = await Message.getMessagesForNonMembers();
    }
    res.render('index', { messages });
  } catch (err) {
    console.error(err);
    res.send("Error fetching messages");
  }
}

async function deleteMessagePost(req, res) {
  try {
    if (!req.user || !req.user.is_admin) {
      return res.status(403).send("You are not authorized to delete messages");
    }
    const messageId = req.params.id;
    await Message.deleteMessage(messageId);

    res.redirect("/"); // or wherever you want
  } catch (err) {
    console.error(err);
    res.send("Error deleting message");
  }
}

module.exports = {
  createMessageget,
  createMessagepost,
  viewMessagesget,
  deleteMessagePost,
  validatePost
};