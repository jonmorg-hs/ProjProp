const router = require("express").Router();
const { savedProperties, Properties } = require("../../models");
const withAuth = require("../../utils/auth");

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "property_db",
});

router.get("/", withAuth, async (req, res) => {
  await db.query(
    `SELECT * FROM savedProperties LEFT JOIN Properties ON savedProperties.property_id = Properties.id LEFT JOIN Events ON savedProperties.property_id = Events.property_id LEFT JOIN Eventtypes ON Events.event_id = Eventtypes.id WHERE savedProperties.user_id = ? `,
    req.session.user_id,
    async (error, results) => {
      if (error) {
        throw error;
      } else {
        let output = [];
        for (var i = 0; i < results.length; i++) {
          var marker = {};
          marker.id = results[i]["id"];
          marker.address = results[i]["address"];
          marker.lat = results[i]["latitude"];
          marker.lng = results[i]["longitude"];
          marker.lng = results[i]["longitude"];
          marker.event = results[i]["title"];
          marker.start_date = results[i]["event_start_dt"];
          marker.end_date = results[i]["event_end_dt"];
          output.push(marker);
        }
        res.json(output);
      }
    }
  );
});

module.exports = router;
