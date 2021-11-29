const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// create our Post model
class Properties extends Model {}

// create fields/columns for Post model
Properties.init(
  {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "user",
      key: "id",
    },
  },
  created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
  },
  update_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
  },
  },  
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "properties",
  }
);

module.exports = Properties;
