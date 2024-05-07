const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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

schema.plugin(mongoosePaginate); // await ProductModel.paginate({query}, {config (limit, page, lean, etc.)})
module.exports = mongoose.model('Product', schema, collection)