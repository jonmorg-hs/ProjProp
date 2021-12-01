const router = require("express").Router();
const {
  User,
  Properties,
  Events,
  Eventtypes,
  savedProperties,
  Review,
} = require("../models");
const sequelize = require("../config/connection");
const withAuth = require("../utils/auth");

router.get("/", withAuth, (req, res) => {
  savedProperties
    .findAll({
      where: {
        user_id: req.session.user_id,
      },
      attributes: ["id", "user_id", "property_id"],
      include: [
        {
          model: Properties,
          attributes: ["id", "address", "latitude", "longitude"],
          include:[ {
            model: Events,
            attributes: [
              "event_id",
              "event_start_dt",
              "event_end_dt",
              "event_start_time",
              "event_end_time",
            ],
            include: {
              model: Eventtypes,
              attributes: ["title"],
            },
          },
          {
            model: Review,
            attributes: ["property_id", "event_like"],
          },
        ]
        },
      ],
    })
    .then((results) => {
      const savedProperties = results.map((property) => property.get({ plain: true }));
      console.log(savedProperties);
      res.render("dashboard", {
        savedProperties,
        loggedIn: true,
        registered: req.session.registered,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/create/", withAuth, (req, res) => {
  Properties.findAll({
    where: {
      user_id: req.session.user_id,
    },
  })
    .then((registerData) => {
      const register = registerData.map((reg) => reg.get({ plain: true }));
      if (register.length > 0) {
        res.render("create-event", {
          register,
          loggedIn: true,
          registered: req.session.registered,
        });
      } else {
        res.render("register-property", {
          register,
          loggedIn: true,
          registered: req.session.registered,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/search/", withAuth, (req, res) => {
  Properties.findAll({})
    .then((propertiesData) => {
      const properties = propertiesData.map((property) => property.get({ plain: true }));
      res.render("search-property", {
        properties,
        loggedIn: true,
        registered: req.session.registered,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


router.delete("/:id", withAuth, (req, res) => {
  savedProperties
    .destroy({
      where: {
        property_id: req.params.id,
        user_id: req.session.user_id,
      },
    })
    .then((deleteData) => {
      const deletedProperty = deleteData.map((property) => property.get({ plain: true }));
      res.render("dashboard", {
        deletedProperty,
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
