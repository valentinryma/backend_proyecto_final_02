const Router = require(`${__dirname}/router.js`);
const { PUBLIC, USER } = require(`${__dirname}/policies.constants.js`);
class ProductsRouter extends Router {
    init() {
        // Instancia del CartManager
        const getManager = (req) => {
            return req.app.get('productManager');
        }

        // Retorna todos los productos
        this.get('/', [PUBLIC], async (req, res) => {
            const productManager = getManager(req);
            const query = req.query;

            try {
                const results = await productManager.getProducts(query);
                results.status = 'success';
                res.json(results);
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false });
            }
        });

        // Retorna un producto por ID
        this.get('/:id', [PUBLIC], async (req, res) => {
            const productManager = getManager(req);

            try {
                const product = await productManager.getProductById(req.params.id);
                res.json(product);
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false });
            }
        });

        // Crea un producto
        this.post('/', [PUBLIC], async (req, res) => {
            const productManager = getManager(req);

            try {
                const newProduct = await productManager.addProduct(req.body);
                res.json(newProduct);
            } catch (error) {
                return res.status(400).json({ success: false, error: error.message });
            }
        });

        // Elimina un producto por ID
        this.delete('/:id', [PUBLIC], async (req, res) => {
            const productManager = getManager(req);

            try {
                const productDelte = await productManager.deleteById(req.params.id);

                if (productDelte.deletedCount == 0) {
                    res.status(404).json({ error: 'Product not found' });
                    return;
                }

                res.json({ success: true })
            } catch (error) {
                return res.status(400).json({ success: false, error: error.message });
            }
        })
    }
}
module.exports = ProductsRouter;