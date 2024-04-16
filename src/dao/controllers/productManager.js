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
        // Query Filters
        const title = filters && filters.title;
        const status = filters && filters.status;
        const category = filters && filters.category;

        // Query Paginate - Options
        const limit = (filters && filters.limit) || 10;
        const page = (filters && filters.page) || 1;
        let sort = (filters && filters.sort);

        const conditions = []

        // Query Filters 
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
        }

        if (status) {
            conditions.push({ status })
        }

        // Query final & Query Options
        const query = {
            $and: conditions
        }

        const options = {
            limit,
            page,
            lean: true
        }

        // Si tiene sort, lo agrega a las opciones, sino no aplica ningun ordenamiento.
        if (sort) {
            options.sort = { price: +sort }
        }

        let results = conditions.length
            ? await ProductModel.paginate(query, options)
            : await ProductModel.paginate({}, options);

        if (results.hasPrevPage) {
            results.prevPage = `/api/products?page=${results.prevPage}`;
        }
        if (results.hasNextPage) {
            results.nextPage = `/api/products?page=${results.nextPage}`;
        }

        // Reemplazamos "docs" con "payload"
        results.payload = results.docs;
        delete results.docs;

        return results;
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