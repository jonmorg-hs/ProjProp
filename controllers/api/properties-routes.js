const router = require("express").Router();
const {
  Properties,
  savedProperties,
  Events,
  Eventtypes,
  Review,
} = require("../../models");
const sequelize = require("../../config/connection");
const withAuth = require("../../utils/auth");

router.post("/", withAuth, (req, res) => {
  Properties.create({
    description: "test",
    address: req.body.address,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    user_id: req.session.user_id,
  })
    .then((registerData) => res.json(registerData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/save/", withAuth, (req, res) => {
  savedProperties
    .create({
      user_id: req.session.user_id,
      property_id: req.body.id,
    })
    .then((savedData) => res.json(savedData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/like/", withAuth, (req, res) => {
  console.log(req.body);
  Properties.findOne({
    where: {
      id: req.body.property_id,
    },
    attributes: ["id", "address", "latitude", "longitude"],
    include: {
      model: Events,
      attributes: [
        "event_id",
        "event_start_dt",
        "event_end_dt",
        "event_start_time",
        "event_end_time",
      ],
    },
  })
    .then((results) => {
      console.log(JSON.stringify(results));
      var event_id = results["events"].event_id;

      Review.create({
        user_id: req.session.user_id,
        property_id: req.body.property_id,
        event_id: event_id,
        event_like: true,
      })
        .then((savedData) => res.json(savedData))
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/search/", withAuth, (req, res) => {
  var radius = req.body.radius;
  var lat = req.body.lat;
  var lng = req.body.lng;

  Properties.findAll({
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
  })
    .then((propertyData) => {
      let output = [];
      for (var i = 0; i < propertyData.length; i++) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(propertyData[i]["latitude"] - lat); // deg2rad below
        var dLon = deg2rad(propertyData[i]["longitude"] - lng);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat)) *
            Math.cos(deg2rad(propertyData[i]["latitude"])) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        var reviews = propertyData[i]["reviews"].length;
        var reviewdata = propertyData[i]["reviews"];
        var like = "like";
        for (var j = 0; j < reviewdata.length; j++) {
          if (reviewdata[j]["user_id"] == req.session.user_id) {
            like = "liked";
          }
        }
        if (d < radius) {
          var marker = {};
          marker.id = propertyData[i]["id"];
          marker.address = propertyData[i]["address"];
          marker.lat = propertyData[i]["latitude"];
          marker.lng = propertyData[i]["longitude"];
          if (propertyData[i]["event"] == null) {
            marker.event_id = "";
            marker.event = "";
            marker.start_date = "";
            marker.end_date = "";
            marker.start_time = "";
            marker.end_time = "";
          } else {
            marker.event_id = propertyData[i]["event"]["event_id"];
            marker.event = propertyData[i]["event"]["eventtype"]["title"];
            marker.start_date = propertyData[i]["event_start_dt"];
            marker.end_date = propertyData[i]["event_end_dt"];
            marker.start_time = propertyData[i]["event_start_time"];
            marker.end_time = propertyData[i]["event_end_time"];
          }
          marker.reviews = reviews;
          marker.like = like;
          output.push(marker);
        }
      }
      res.json(output);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/saved/", withAuth, (req, res) => {
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
    .then((propertyData) => {
      let output = [];
      for (var i = 0; i < propertyData.length; i++) {
        var reviews = propertyData[i]["property"]["reviews"].length;
        var reviewdata = propertyData[i]["property"]["reviews"];
        var like = "like";
        for (var j = 0; j < reviewdata.length; j++) {
          if (reviewdata[j]["user_id"] == req.session.user_id) {
            like = "liked";
          }
        }

        var marker = {};
        marker.id = propertyData[i]["property"]["id"];
        marker.address = propertyData[i]["property"]["address"];
        marker.lat = propertyData[i]["property"]["latitude"];
        marker.lng = propertyData[i]["property"]["longitude"];
        if (propertyData[i]["property"]["event"] == null) {
          marker.event_id = "";
          marker.event = "";
          marker.start_date = "";
          marker.end_date = "";
          marker.start_time = "";
          marker.end_time = "";
        } else {
          marker.event_id = propertyData[i]["property"]["event"]["event_id"];
          marker.event =
            propertyData[i]["property"]["event"]["eventtype"]["title"];
          marker.start_date =
            propertyData[i]["property"]["event"]["event_start_dt"];
          marker.end_date =
            propertyData[i]["property"]["event"]["event_end_dt"];
          marker.start_time =
            propertyData[i]["property"]["event"]["event_start_time"];
          marker.end_time =
            propertyData[i]["property"]["event"]["event_end_time"];
        }
        marker.reviews = reviews;
        marker.like = like;
        output.push(marker);
      }
      res.json(output);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = router;
