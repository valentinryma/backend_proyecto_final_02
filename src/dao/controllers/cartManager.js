// Modelos 
const CartModel = require(`${__dirname}/../models/cart.model.js`)
const ProductModel = require(`${__dirname}/../models/product.model.js`)

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
            const cartFound = await CartModel.findOne({ _id: id }).lean().populate('products._id');
            if (cartFound == null) {
                throw new Error('Cart not found');
            }
            // console.log(JSON.stringify(cartFound, null, 4));
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
        product.quantity = product.quantity || 1;
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
            let found = cartFound.products.find((product) => {
                return (product._id._id.toString()) === pid;
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

    // Borra un carrito completo
    async deleteById(id) {
        await CartModel.deleteOne({ _id: id });
    }

    async deleteProductCart(cid, pid) {
        try {
            // Verifica la existencia del Carrito
            const cartFound = await this.getCartById(cid);
            if (cartFound.error) {
                throw new Error('Cart not found');
            }

            // Verifica si el producto ya existe dentro del carrito.
            const found = cartFound.products.find((product) => {
                return (product._id._id.toString()) === pid;
            });

            if (!found) {
                throw Error('Product not in cart');
            }

            // Elimina el producto en el carrito
            const cartUpdate = await CartModel.updateOne({ _id: cid }, {
                $pull: { products: { _id: pid } }
            });

            return cartUpdate;
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    async updateCartProductArray(cid, productsArray) {
        // console.log(productsArray)
        // [
        //     { "_id": "661d76aabb4d518258508e85", "quantity": 4 },
        //     { "_id": "661ea349287a782d438d9770", "quantity": 2 },
        //     { "_id": "661ea349287a782d438d9770", "quantity": 4 }
        // ]

        try {
            const cartFound = await this.getCartById(cid);
            if (cartFound.error) {
                throw new Error('Cart not found');
            }

            const cartUpdate = await CartModel.updateOne({ _id: cid }, {
                $set: { products: productsArray }
            });
            return cartUpdate;
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    async updateCartProductQuantity(cid, product) {
        const pid = product.pid;
        const newQuantity = product.quantity;

        try {
            const cartFound = await this.getCartById(cid);
            if (cartFound.error) {
                throw Error('Cart not found')
            }

            // Verifica si el producto existe dentro del carrito.
            const found = cartFound.products.find((product) => {
                return (product._id).toString() === pid;
            });

            if (!found) {
                throw Error('Product not in cart');
            }

            // Actualiza el quantity del producto en el carrito
            const cartUpdate = await CartModel.updateOne({ _id: cid, "products._id": pid }, {
                $set: { "products.$.quantity": newQuantity }
            });

            return cartUpdate;

        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    async clearCart(cid) {
        try {
            const cartFound = await this.getCartById(cid);
            if (!cartFound) {
                throw Error;
            }
            const clearCart = await CartModel.updateOne({ _id: cid }, { $set: { products: [] } });
            return clearCart;
        } catch (error) {
            throw Error(error)
        }
    }

}
module.exports = CartManager;