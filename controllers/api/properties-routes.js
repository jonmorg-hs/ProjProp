const router = require("express").Router();
const { Properties, savedProperties } = require("../../models");
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

router.post("/search/", withAuth, (req, res) => {
  var radius = req.body.radius;
  var lat = req.body.lat;
  var lng = req.body.lng;

  Properties.findAll({})
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
        if (d < radius) {
          var marker = {};
          marker.id = propertyData[i]["id"];
          marker.address = propertyData[i]["address"];
          marker.lat = propertyData[i]["latitude"];
          marker.lng = propertyData[i]["longitude"];
          output.push(marker);
        }
      }
      console.log(output);
      res.json(output);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", withAuth, (req, res) => {
  Properties.findAll({
    where: {
      id: req.params.id,
    },
  })
    .then((propertyData) => res.json(propertyData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = router;
