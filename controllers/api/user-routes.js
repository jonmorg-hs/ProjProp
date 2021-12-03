const router = require("express").Router();
const { User, Properties } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const propertyData = await Properties.findAll({
      where: {
        user_id: req.session.id,
      },
    });

    if (propertyData.length > 0) {
      const dbUserData = await User.findOne({
        where: {
          username: req.body.username,
        },
      });

      if (!dbUserData) {
        res
          .status(400)
          .json({ message: "Incorrect email or password, please try again" });
        return;
      }

      const validPassword = dbUserData.checkPassword(req.body.password);

      if (!validPassword) {
        res
          .status(400)
          .json({ message: "Incorrect email or password, please try again" });
        return;
      }

      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        req.session.registered = true;
        res.json({ user: dbUserData, message: "You are now logged in!" });
      });
    } else {
      const dbUserData = await User.findOne({
        where: {
          username: req.body.username,
        },
      });

      if (!dbUserData) {
        res
          .status(400)
          .json({ message: "Incorrect email or password, please try again" });
        return;
      }

      const validPassword = dbUserData.checkPassword(req.body.password);

      if (!validPassword) {
        res
          .status(400)
          .json({ message: "Incorrect email or password, please try again" });
        return;
      }

      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        req.session.registered = false;
        res.json({ user: dbUserData, message: "You are now logged in!" });
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
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
