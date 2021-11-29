const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// create our Post model
class savedProperties extends Model {}

// create fields/columns for Post model
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
