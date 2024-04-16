const Router = require('express');
const router = Router();

router.get('/', (_, res) => {
    res.render('index', {
        title: 'Pagina Principal',
        srcripts: [],
        styles: []
    })
})

// TODO View ver todos los productos
router.get('/products', (_, res) => {
    res.render('products', {
        title: 'Productos',
        srcripts: [],
        styles: ['products.css']
    })
})

// TODO View carrito unico - Listar SOLO los productos.
router.get('/carts/:cid', (req, res) => {
    const cid = req.params.cid;

    res.render('cart', {
        title: 'Carrito',
        srcripts: [],
        styles: []
    })
})

module.exports = router;