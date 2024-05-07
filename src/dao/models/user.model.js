const mongoose = require('mongoose');
const collection = 'users';
const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
        type: String,
        default: 'user'
    }
})

module.exports = mongoose.model('User', schema, collection)