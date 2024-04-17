const { Router } = require('express');
const product = require('../dao/models/product');
const router = Router();

router.get('/products', async (req, res) => {
    const productManager = req.app.get('productManager');
    const results = await productManager.getProducts(req.query);

    res.render('products', {
        title: 'Pagina Principal',
        scripts: ['products.js'],
        styles: ['products.css'],
        results
    })
})

router.get('/carts/:id', async (req, res) => {
    const cartManager = req.app.get('cartManager');
    const cart = await cartManager.getCartById(req.params.id);
    const calcTotal = (cart) => {
        let total = 0;
        for (const product of cart) {
            total += product._id.price * product.quantity;
        }
        return total.toLocaleString()
    }

    const total = calcTotal(cart.products);
    res.render('cartId', {
        title: 'Cart Buy',
        scripts: ['carts.js'],
        styles: ['carts.css'],
        products: cart.products,
        total,
        cartId: req.params.id
    })
})

module.exports = router;