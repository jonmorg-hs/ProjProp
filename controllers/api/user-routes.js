const router = require("express").Router();
const { User, Properties } = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/", (req, res) => {
  User.findAll({
    attributes: { exclude: ["password"] },
  })
    .then((userData) => res.json(userData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  }).then((userData) => {
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.loggedIn = true;
      res.json(userData);
    });
  });
});

router.post("/login", (req, res) => {
  Properties.findAll({
    where: {
      user_id: req.session.id,
    },
  }).then((propertyData) => {
    if (propertyData.length > 0) {
      User.findOne({
        where: {
          username: req.body.username,
        },
      }).then((dbUserData) => {
        if (!dbUserData) {
          res
            .status(400)
            .json({ message: "No user with that username exists!" });
          return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
          res.status(400).json({ message: "Incorrect password!" });
          return;
        }

        req.session.save(() => {
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
          req.session.registered = true;
          res.json({ user: dbUserData, message: "You are now logged in!" });
        });
      });
    } else {
      User.findOne({
        where: {
          username: req.body.username,
        },
      }).then((dbUserData) => {
        if (!dbUserData) {
          res
            .status(400)
            .json({ message: "No user with that username exists!" });
          return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
          res.status(400).json({ message: "Incorrect password!" });
          return;
        }

        req.session.save(() => {
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
          req.session.registered = false;
          res.json({ user: dbUserData, message: "You are now logged in!" });
        });
      });
    }
  });
});

router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
