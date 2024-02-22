const mongoose = require('mongoose');

const schema = mongoose.Schema
const PostSchema = new schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    FootballClub: {
        type: String,
        required: true
    },
    PhoneNumber: {
        type: Number,
        required: true
    },
    TeamDetails: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true
    },
    Time: {
        type: String,
        required: true
    },
    EmailAddress: {
        type: String,
        required: true
    }
})

const Bookings = mongoose.model('Book', PostSchema);

module.exports = Bookings;