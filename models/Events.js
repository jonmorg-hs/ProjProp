const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// create our Post model
class Events extends Model {}

// create fields/columns for Post model
Events.init(
  {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },   
    property_id:{
        type: DataTypes.INTEGER,
        references:{
            model: 'properties',
            key: 'id',
        },
    },   
   event_id:{
        type: DataTypes.INTEGER,
        references:{
            model: 'eventtypes',
            key: 'id',
        },
    },
    event_start_dt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    event_end_dt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    event_start_time:{
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
        
    },
    event_end_time:{
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
        
    },
  },  
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "events",
  }
);

module.exports = Events;
