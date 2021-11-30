const sequelize = require("../config/connection");

const { User, Properties, Eventtypes, Events, Review } = require("../models");

const seedUsers = require("./userSeeds.json");
 const seedReviews = require("./reviews.json"); 
const seedEvents = require("./events.json");
 const seedProperties = require("./propertiesSeeds.json");
const seedEventTypes = require("./eventTypes.json");

const seedAll = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(seedUsers, {
    individualHooks: true,
    returning: true,
  });

  const properties = await Properties.bulkCreate(seedProperties);
  const eventTypes = await Eventtypes.bulkCreate(seedEventTypes);
  const events = await Events.bulkCreate(seedEvents);
  const reviews = await Review.bulkCreate(seedReviews);

  process.exit(0);
};

seedAll();
