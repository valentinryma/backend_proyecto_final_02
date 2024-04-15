const mongoose = require('mongoose');

const collection = 'carts';

const schema = new mongoose.Schema({
    products: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            require: true
        },

        quantity: {
            type: Number,
            require: true
        }
    }],
})

// Virtual
schema.virtual('id').get(function () {
    return this._id.toString();
});

module.exports = mongoose.model('Cart', schema, collection);