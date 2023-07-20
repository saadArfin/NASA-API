const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    // target: {
    //     type: mongoose.ObjectId,
    //     ref: 'Planet'
    // }
    target: {
        type: String,
    },
    customers: [ String ],
    upcoming: {
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        default: true,
        required: true,
    },
});

//Connects launchesSchema with the "launches" (because "Launch" will be automatically lowercased and made plural by mongoDB) collection.
module.exports = mongoose.model('Launch', launchesSchema);