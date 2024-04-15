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

    async getCartById(id) {
        try {
            const cartFound = await CartModel.findOne({ _id: id });
            if (cartFound == null) {
                throw new Error('Cart not found');
            }
            return cartFound;
        } catch (error) {
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
        const pid = product.pid;
        try {
            const cartFound = await this.getCartById(cid);
            if (cartFound.error) {
                throw new Error('Cart not found');
            }

            const productFound = await ProductModel.findOne({ _id: product.pid });
            if (productFound == null) {
                throw new Error('Product not found');
            }

            // Verifica si el producto ya existe dentro del carrito.
            const found = cartFound.products.find((product) => {
                return (product._id).toString() === pid;
            });

            // Sumar la cantidad si el producto ya existe en el carrito
            if (found) {
                const newQuantity = product.quantity + found.quantity
                const cartUpdate = await CartModel.updateOne({ _id: cid, 'products._id': pid }, { $set: { 'products.$.quantity': newQuantity } });
                return cartUpdate;
            }

            // Agregar el producto en el carrito
            const cartUpdate = await CartModel.updateOne({ _id: cid }, {
                $push: { products: { _id: product.pid, quantity: product.quantity } }
            });

            return cartUpdate;
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    async deleteById(id) {
        await CartModel.deleteOne({ _id: id });
    }


    // TODO: clearCart
    // async clearCart(cid) {
    //     try {
    //         const cartFound = await this.getCartById(cid);
    //         if (!cartFound) {
    //             throw Error;
    //         }
    //         await CartModel.updateOne({ _id: cid }, { $set: { products: [] } });
    //         return await CartModel.find({ _id: cid });

    //     } catch (error) {
    //         throw Error(error)
    //     }
    // }

}
module.exports = CartManager;