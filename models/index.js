const User = require("./User");
const Eventtypes = require("./Eventtypes");
const Properties = require("./Properties");
const Events = require("./Events");
const Review = require("./Review");
const savedProperties = require("./savedProperties");

Properties.belongsTo(User, {
  foreignKey: "user_id",
});

savedProperties.belongsTo(User, {
  foreignKey: "user_id",
});

savedProperties.belongsTo(Properties, {
  foreignKey: "property_id",
});

Eventtypes.belongsTo(User, {
  foreignKey: "user_id",
});

Properties.hasMany(Review, {
  foreignKey: "property_id",
});

Review.belongsTo(Properties, {
  foreignKey: "property_id",
});

Review.hasMany(Events, {
  foreignKey: "event_id",
});

Review.belongsTo(User, {
  foreignKey: "user_id",
});

Properties.hasOne(Events, {
  foreignKey: "property_id",
});

Events.belongsTo(Properties, {
  foreignKey: "property_id",
});

Events.belongsTo(Eventtypes, {
  foreignKey: "event_id",
});

module.exports = {
  User,
  Properties,
  Eventtypes,
  Events,
  Review,
  savedProperties,
};
