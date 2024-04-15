const Router = require('express');
const router = Router();

// Retorna una instancia del Manager.
const getManager = (req) => {
    return req.app.get('productManager');
}

router.get('/', async (req, res) => {
    const productManager = getManager(req);

    try {
        const products = await productManager.getProducts(req.query);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
});

router.get('/:id', async (req, res) => {
    const productManager = getManager(req);

    try {
        const product = await productManager.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
});

router.post('/', async (req, res) => {
    const productManager = getManager(req);

    try {
        const newProduct = await productManager.addProduct(req.body);
        res.json(newProduct);
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
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

module.exports = router;