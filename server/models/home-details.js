const mongoose = require('mongoose');

const schema = mongoose.Schema
const PostSchema = new schema({
    title: {
        type: String,
        required: true
    },
    brief: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }
})

const HomeDetails = mongoose.model('Homedetails', PostSchema);

module.exports = HomeDetails;