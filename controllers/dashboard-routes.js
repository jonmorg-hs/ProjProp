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
          include: [
            {
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
              attributes: ["user_id", "property_id", "event_like"],
            },
          ],
        },
      ],
    })
    .then((results) => {
      const savedProperties = results.map((property) =>
        property.get({ plain: true })
      );
      for (var i = 0; i < savedProperties.length; i++) {
        var reviewdata = savedProperties[i]["property"]["reviews"];
        var reviews = reviewdata.length;
        savedProperties[i]["property"]["reviews"] = reviews;
        var like = "like";
        for (var j = 0; j < reviewdata.length; j++) {
          if (reviewdata[j]["user_id"] === req.session.user_id) {
            like = "liked";
          }
        }
        savedProperties[i]["property"]["like"] = like;
      }
      console.log(JSON.stringify(savedProperties));
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
    attributes: ["id", "address"],
    include: [
      {
        model: Events,
        attributes: [
          "id",
          "event_id",
          "event_start_dt",
          "event_end_dt",
          "event_start_time",
          "event_end_time",
        ],
        include: {
          model: Eventtypes,
          attributes: ["id", "title"],
        },
      },
      {
        model: Review,
        attributes: ["user_id", "property_id", "event_like"],
      },
    ],
  })
    .then((registerData) => {
      const register = registerData.map((reg) => reg.get({ plain: true }));
      for (var i = 0; i < register.length; i++) {
        register[i].reviews = register[i].reviews.length;
        if (register[i].reviews.length > 0) {
          register[i].like = "liked";
        } else {
          register[i].like = "like";
        }

        if (register[i].event.event_id === 1) {
          register[i].option1 = "selected";
          register[i].option2 = "";
          register[i].option3 = "";
        } else if (register[i].event.event_id === 2) {
          register[i].option1 = "";
          register[i].option2 = "selected";
          register[i].option3 = "";
        } else {
          register[i].option1 = "";
          register[i].option2 = "";
          register[i].option3 = "selected";
        }
      }
      var send = register[0];
      if (register.length === 0) {
        res.render("register-property", {
          send,
          loggedIn: true,
          registered: req.session.registered,
        });
        //}
        //else if (register[0].event == null) {
        //     res.render("create-event", {
        //      send,
        //     loggedIn: true,
        //     registered: req.session.registered,
        //   });
      } else {
        res.render("update-event", {
          send,
          loggedIn: true,
          registered: req.session.registered,
        });
      }
      //}
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/search/", withAuth, (req, res) => {
  Properties.findAll({})
    .then((propertiesData) => {
      const properties = propertiesData.map((property) =>
        property.get({ plain: true })
      );
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
      const deletedProperty = deleteData.map((property) =>
        property.get({ plain: true })
      );
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
