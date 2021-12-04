const router = require("express").Router();

const {
  Properties,
  savedProperties,
  Events,
  Eventtypes,
  Review,
} = require("../../models");
const withAuth = require("../../utils/auth");

router.post("/", withAuth, async (req, res) => {
  try {
    const registerData = await Properties.create({
      description: "test",
      address: req.body.address,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      user_id: req.session.user_id,
    });
    res.json(registerData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/save/", withAuth, async (req, res) => {
  try {
    const savedData = await savedProperties.create({
      user_id: req.session.user_id,
      property_id: req.body.id,
    });
    res.json(savedData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/like/", withAuth, async (req, res) => {
  try {
    const results = await Properties.findAll({
      where: {
        id: req.body.property_id,
      },
      attributes: ["id", "address", "latitude", "longitude"],
      include: {
        model: Events,
        attributes: [
          "id",
          "event_id",
          "event_start_dt",
          "event_end_dt",
          "event_start_time",
          "event_end_time",
        ],
      },
    });

    let event_id = results[0]["event"].event_id;
    const savedData = await Review.create({
      user_id: req.session.user_id,
      property_id: req.body.property_id,
      event_id: event_id,
      event_like: true,
    });

    res.json(savedData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/search/", withAuth, async (req, res) => {
  try {
    let radius = req.body.radius;
    let lat = req.body.lat;
    let lng = req.body.lng;

    const propertyData = await Properties.findAll({
      attributes: ["id", "address", "latitude", "longitude"],
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
          where: {
            event_id: req.body.event_id,
          },
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
    });

    let output = radiusSearch(
      propertyData,
      lat,
      lng,
      req.session.user_id,
      radius
    );

    res.json(output);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/saved/", withAuth, async (req, res) => {
  try {
    const propertyData = await savedProperties.findAll({
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
    });

    let output = [];
    for (let i = 0; i < propertyData.length; i++) {
      let reviews = propertyData[i]["property"]["reviews"].length;
      let reviewdata = propertyData[i]["property"]["reviews"];
      let like = "like";
      for (let j = 0; j < reviewdata.length; j++) {
        if (reviewdata[j]["user_id"] == req.session.user_id) {
          like = "liked";
        }
      }

      let marker = {};
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
        marker.end_date = propertyData[i]["property"]["event"]["event_end_dt"];
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
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

function radiusSearch(propertyData, lat, lng, user_id, radius) {
  let output = [];
  for (let i = 0; i < propertyData.length; i++) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(propertyData[i]["latitude"] - lat); // deg2rad below
    let dLon = deg2rad(propertyData[i]["longitude"] - lng);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat)) *
        Math.cos(deg2rad(propertyData[i]["latitude"])) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    let reviews = propertyData[i]["reviews"].length;
    let reviewdata = propertyData[i]["reviews"];
    let like = "like";
    for (let j = 0; j < reviewdata.length; j++) {
      if (reviewdata[j]["user_id"] == user_id) {
        like = "liked";
      }
    }
    if (d < radius) {
      let marker = {};
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
        marker.start_date = propertyData[i]["event"]["event_start_dt"];
        marker.end_date = propertyData[i]["event"]["event_end_dt"];
        marker.start_time = propertyData[i]["event"]["event_start_time"];
        marker.end_time = propertyData[i]["event"]["event_end_time"];
      }
      marker.reviews = reviews;
      marker.like = like;
      output.push(marker);
    }
  }
  return output;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = { router, radiusSearch };
