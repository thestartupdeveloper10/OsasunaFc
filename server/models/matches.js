const mongoose = require('mongoose');

const schema = mongoose.Schema
const PostSchema = new schema({
    Hometeam: {
        type: String,
        required: true
    },
    Awayteam: {
        type: String,
        required: true
    },
    Matchtype: {
        type: String,
        required: true
    },
    Matchdate: {
        type: Date,
        required: true
    },
    Matchtime: {
        type: String,
        required: true
    },
    Matchvenue: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Matches = mongoose.model('Matches', PostSchema);

module.exports = Matches;