const router = require("express").Router();
const {
  savedProperties,
  Properties,
  Events,
  Eventtypes,
} = require("../../models");
const withAuth = require("../../utils/auth");
const sequelize = require("../../config/connection");

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
    .then((dbPostData) => {
      const results = dbPostData.map((post) => post.get({ plain: true }));
      console.log(results);

      let output = [];
      for (var i = 0; i < results.length; i++) {
        var reviews = results[i]["property"]["reviews"].length;
        var reviewdata = results[i]["property"]["reviews"];
        var like = "like";
        for (var j = 0; j < reviewdata.length; j++) {
          if (reviewdata[j]["user_id"] == req.session.user_id) {
            like = "liked";
          }
        }

        var marker = {};
        marker.id = results[i]["id"];
        marker.address = results[i]["property"]["address"];
        marker.lat = results[i]["property"]["latitude"];
        marker.lng = results[i]["property"]["longitude"];
        marker.event_id = results[i]["events"]["event_id"];
        marker.event = results[i]["events"]["eventtype"]["title"];
        marker.start_date = results[i]["events"]["event_start_dt"];
        marker.end_date = results[i]["events"]["event_end_dt"];
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

module.exports = router;
