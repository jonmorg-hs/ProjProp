const router = require("express").Router();

const userRoutes = require("./user-routes");
const postRoutes = require("./post-routes");
const commentRoutes = require("./comment-routes");
const propertiesRoutes = require("./properties-routes");
const eventsRoutes = require("./events-routes");
const savedpropertiesRoutes = require("./savedproperties-routes");

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/properties", propertiesRoutes);
router.use("/savedproperties", savedpropertiesRoutes);
router.use("/events", eventsRoutes);

module.exports = router;
