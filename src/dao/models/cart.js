const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const collection = 'carts';

const schema = new mongoose.Schema({
    products: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'Product'

        },

        quantity: {
            type: Number,
            require: true
        },
    }],
})

// Virtual
schema.virtual('id').get(function () {
    return this._id.toString();
});

schema.plugin(mongoosePaginate); // await CartModel.paginate({query}, {config (limit, page, lean, etc.)})
module.exports = mongoose.model('Cart', schema, collection);