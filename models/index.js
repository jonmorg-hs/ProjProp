const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");
const Eventtypes = require("./Eventtypes");
const Properties = require("./Properties");
const Events = require("./Events");
const Review = require("./Review");
const savedProperties = require("./savedProperties");

//create associations
User.hasMany(Post, {
  foreignKey: "user_id",
});

Post.belongsTo(User, {
  foreignKey: "user_id",
});

Properties.belongsTo(User, {
  foreignKey: "user_id",
});

savedProperties.belongsTo(User, {
  foreignKey: "user_id",
});

savedProperties.belongsTo(Properties, {
  foreignKey: "property_id",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

User.hasMany(Comment, {
  foreignKey: "user_id",
});

Post.hasMany(Comment, {
  foreignKey: "post_id",
});

Eventtypes.belongsTo(Properties, {
  foreignKey: "post_id",
});

Eventtypes.belongsTo(User, {
  foreignKey: "user_id",
});

Review.hasMany(Events, {
  foreignKey: "event_id",
});

Review.belongsTo(User, {
  foreignKey: "user_id",
});

Properties.hasMany(Events, {
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
  Post,
  Comment,
  Properties,
  Eventtypes,
  Events,
  Review,
  savedProperties,
};
