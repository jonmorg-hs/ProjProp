const router = require("express").Router();
const { Properties } = require("../models");

router.get("/", async (req, res) => {
  try {
    const propertyData = await Properties.findAll({
      where: {
        user_id: req.session.id,
      },
      attributes: ["id", "user_id"],
    });

    const properties = propertyData.map((property) =>
      property.get({ plain: true })
    );

    if (propertyData) {
      res.render("homepage", {
        properties,
        loggedIn: req.session.loggedIn,
        registered: true,
      });
    } else {
      res.render("homepage", {
        properties,
        loggedIn: req.session.loggedIn,
        registered: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
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

module.exports = router;
