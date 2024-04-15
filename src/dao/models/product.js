const mongoose = require('mongoose');

const collection = 'products';

const schema = new mongoose.Schema({
    title: { type: String, require: true },
    code: { type: String, require: true, unique: true },
    price: { type: Number, require: true },
    status: { type: Boolean, require: true, default: true },
    stock: { type: Number, require: true },
    category: { type: String, require: true },
    thumbnails: [{ type: String }],
})

// Virtual
schema.virtual('id').get(function () {
    return this._id.toString();
});

module.exports = mongoose.model('Product', schema, collection)