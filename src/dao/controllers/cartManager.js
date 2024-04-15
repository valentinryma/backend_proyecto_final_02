// Modelos 
const CartModel = require(`${__dirname}/../models/cart.js`)
const ProductModel = require(`${__dirname}/../models/product.js`)

// Clase CartManager
class CartManager {
    constructor() { }

    async prepare() {
        if (CartModel.db.readyState != 1) {
            throw new Error('Must connect to MongoDB');
        }
    }

    async getCart() {
        const carts = await CartModel.find();
        return carts.map(c => c.toObject({ virtuals: true }));
    }

    // TODO PROBAR
    async getCartById(id) {
        try {
            const cartFound = await CartModel.findOne({ _id: id });
            if (cartFound == null) {
                throw new Error('Cart not found');
            }
            return cartFound;
        } catch (error) {
            console.error('Error en getCartById', error);
            return { error: error.message };
        }
    }

    async addCart() {
        // nuevo carrito vacio
        try {
            const newCart = await CartModel.create({ products: [] });
            return newCart;
        } catch (error) {
            console.error('Error en addCart()', error);
            return { error: error.message };
        }
    }

    async addProductCart(cid, product) {
        // cid, {_id, quantity}
        console.log(product);
    }

}
module.exports = CartManager;