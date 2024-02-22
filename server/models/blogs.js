const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    images: [{
        type: String, // Store the filename of the image
        required: true
    }]
});

const Blog = mongoose.model('Blogs', PostSchema);

module.exports = Blog;
