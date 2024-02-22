const mongoose = require('mongoose');

const UserSchema = mongoose.Schema

const userSchema = new UserSchema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('Admin-user', userSchema);

module.exports = User;