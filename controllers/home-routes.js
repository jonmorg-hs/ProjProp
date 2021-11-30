const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment, Properties } = require("../models");

router.get("/", (req, res) => {
  Properties.findAll({
    where: {
      user_id: req.session.id,
    },
    attributes: ["id", "user_id"],
  })
    .then((propertyData) => {
      const posts = propertyData.map((post) => post.get({ plain: true }));
      if (propertyData.length > 0) {
        res.render("homepage", {
          posts,
          loggedIn: req.session.loggedIn,
          registered: true,
        });
      } else {
        res.render("homepage", {
          posts,
          loggedIn: req.session.loggedIn,
          registered: false,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("signup");
});

router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "created_at", "post_content"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      const post = dbPostData.get({ plain: true });

      res.render("single-post", {
        post,
        loggedIn: true,
        registered: req.session.registered,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
