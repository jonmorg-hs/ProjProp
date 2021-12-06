const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class savedProperties extends Model {}

savedProperties.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
    property_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "properties",
        key: "id",
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "savedproperties",
  }
);

module.exports = savedProperties;
