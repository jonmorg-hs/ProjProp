const { Properties } = require("../models");

const propertiesData = [
  {
    description: "Christmas Lights!",
    address: "35 Otterington Grove, Ivanhoe",
    latitude: -37.77669,
    longitude: 145.05574,
    user_id: 1,
  },
  {
    description: "Christmas Lights!",
    address: "150 The Boulevard, Ivanhoe",
    latitude: -37.77347,
    longitude: 145.05055,
    user_id: 2,
  },
  {
    description: "Christmas Lights!",
    address: "158 The Boulevard, Ivanhoe",
    latitude: -37.77385,
    longitude: 145.05109,
    user_id: 3,
  },
  {
    description: "Christmas Lights!",
    address: "170 The Boulevard, Ivanhoe",
    latitude: -37.77461,
    longitude: 145.05202,
    user_id: 4,
  },
  {
    description: "Christmas Lights!",
    address: "180 The Boulevard, Ivanhoe",
    latitude: -37.77503,
    longitude: 145.05265,
    user_id: 5,
  },
  {
    description: "Christmas Lights!",
    address: "144 The Boulevard, Ivanhoe",
    latitude: -37.77278,
    longitude: 145.04945,
    user_id: 6,
  },
  {
    description: "Christmas Lights!",
    address: "197 The Boulevard, Ivanhoe",
    latitude: -37.7765,
    longitude: 145.05475,
    user_id: 7,
  },
  {
    description: "Christmas Lights!",
    address: "205 The Boulevard, Ivanhoe",
    latitude: -37.77705,
    longitude: 145.05542,
    user_id: 8,
  },
  {
    description: "Christmas Lights!",
    address: "223 The Boulevard, Ivanhoe",
    latitude: -37.777759,
    longitude: 145.05661,
    user_id: 9,
  },
];

const seedProperties = () => Properties.bulkCreate(propertiesData);

module.exports = seedProperties;
