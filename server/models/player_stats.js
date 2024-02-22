const mongoose = require('mongoose');

const schema = mongoose.Schema
const PostSchema = new schema({
    Name: {
        type: String,
        required: true
    },
    Position: {
        type: String,
        required: true
    },
    Appearance: {
        type: String,
        required: true
    },
    Jersey: {
        type: Number,
        required: true
    },
    Goals: {
        type: Number,
        required: true
    },
    Assist: {
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: true
    }
})

const Player_stats = mongoose.model('Player_stats', PostSchema);

module.exports = Player_stats;