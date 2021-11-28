const router = require("express").Router();
const { Property } = require("../../models");
const sequelize = require("../../config/connection");
const withAuth = require("../../utils/auth");

router.post("/", withAuth, (req, res) => {
  let streetaddress =
    req.body.address +
    "," +
    req.body.suburb +
    "," +
    req.body.city +
    "," +
    req.body.postcode;
  let lat = -18.23244;
  let lng = 20.2323;
  let eventid = 1;

  Property.create({
    description: "test",
    address: streetaddress,
    latitude: lat,
    longitude: lng,
    event_id: eventid,
    user_id: req.session.user_id,
  })
    .then((registerData) => res.json(registerData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
