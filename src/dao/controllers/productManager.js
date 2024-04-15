// Modelo: Product
const ProductModel = require(`${__dirname}/../models/product.js`)

// Clase CartManager
class ProductManager {
    constructor() { }

    async prepare() {
        if (ProductModel.db.readyState != 1) {
            throw new Error('Must connect to MongoDB');
        }
    }

    async getProducts(filters = null) {
        // Filtro
        const title = filters && filters.title;
        const category = filters && filters.category;

        const conditions = []

        if (title) {
            conditions.push({
                title: {
                    $regex: `^${title}`,
                    $options: 'i' // Insensitive
                }
            });
        }

        if (category) {
            conditions.push({ category })
        } // -> Filtro

        const products = conditions.length
            ? await ProductModel.find({ $and: conditions })
            : await ProductModel.find();

        return products.map(c => c.toObject({ virtuals: true }));
    }

    async getProductById(id) {
        try {
            const productFound = await ProductModel.findOne({ _id: id });
            if (productFound == null) {
                throw new Error('Product not found');
            }
            return productFound

        } catch (error) {
            console.error('Error en getProductById', error);
            return { error: error.messagge }
        }
    }

    async addProduct(product) {
        const { title, code, price, status, stock, category, thumbnails } = product
        try {
            const newProduct = await ProductModel.create({ title, code, price, status, stock, category, thumbnails });
            return newProduct;
        } catch (error) {
            console.error('Error en addProduct', error);
            return { error: error.messagge };
        }
    }

    async deleteById(id) {
        try {
            const productDelte = await ProductModel.deleteOne({ _id: id });
            return productDelte;
        } catch (error) {
            console.error('Error en deleteById', error)
            return { error: error.messagge };
        }
    }
}
module.exports = ProductManager;