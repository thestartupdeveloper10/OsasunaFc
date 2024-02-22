const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    Fullname: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Enquire: [{
        type: String, 
        required: true
    }]
});

const Contact = mongoose.model('contact', PostSchema);

module.exports = Contact;
