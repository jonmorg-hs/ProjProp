const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// create our Post model
class Review extends Model {}

// create fields/columns for Post model
Review.init(
  {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    event_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'events',
            key: 'id'
        },
    },
    event_like:{
        type: DataTypes.BOOLEAN,
    },  
    review_text:{
        type: DataTypes.STRING,
        
    },

    review_date:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },  
    user_id:{
        type: DataTypes.INTEGER,
        references:{
            model: 'user',
            key: 'id',
        },
    },
  },  
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "review",
  }
);

module.exports = Review;
