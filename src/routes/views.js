const Router = require('express');
const router = Router();

router.get('/products', (req, res) => {
    res.render('products', {
        title: 'Pagina Principal',
        srcripts: ['index.js'],
        styles: ['products.css']
    })
})

module.exports = router;