const { EventTypes } = require("../models");

const eventtypesData = [
    {
        "title": "Christmas Lights",
    },
    {
        "title": "Halloween",
    },
    {
        "title": "Garage Sale",
    },
]

const seedEventTypes = () => EventTypes.bulkCreate(eventtypesData);

module.exports = seedEventTypes;