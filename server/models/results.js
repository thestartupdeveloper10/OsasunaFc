const mongoose = require('mongoose');

const schema = mongoose.Schema
const PostSchema = new schema({
    Hometeam: {
        type: String,
        required: true
    },
    HometeamScore: {
        type: Number,
        required: true
    },
    Awayteam: {
        type: String,
        required: true
    },
    AwayteamScore: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const Results = mongoose.model('Results', PostSchema);

module.exports = Results;