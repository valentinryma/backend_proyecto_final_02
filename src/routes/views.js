const Router = require('express');
const router = Router();

router.get('/', (_, res) => {
    res.render('index', {
        title: 'Pagina Principal',
        srcripts: [],
        styles: []
    })
})

module.exports = router;