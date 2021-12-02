const router = require("express").Router();
const { Events, Properties } = require("../../models");
const sequelize = require("../../config/connection");
const withAuth = require("../../utils/auth");

router.post("/", withAuth, (req, res) => {
  Properties.findAll({
    where: {
      user_id: req.session.user_id,
    },
  })
    .then((propertyData) => {
      if (propertyData.length == 0) {
        res.status(404).json({ message: "No property found for this user" });
        return;
      } else {
        const property = propertyData.map((prop) => prop.get({ plain: true }));
        Events.create({
          property_id: property[0].id,
          event_id: req.body.event_id,
          event_start_dt: req.body.start_date,
          event_end_dt: req.body.end_date,
          event_start_time: req.body.start_time,
          event_end_time: req.body.end_time,
        })
          .then((eventData) => res.json(eventData))
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/:id", withAuth, (req, res) => {
  Events.update(
    {
      event_id: req.body.event_id,
      event_start_dt: req.body.start_date,
      event_end_dt: req.body.end_date,
      event_start_time: req.body.start_time,
      event_end_time: req.body.end_time,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((updateEventData) => {
      if (!updateEventData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(updateEventData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
