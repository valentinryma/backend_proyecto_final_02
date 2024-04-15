const Router = require('express');
const router = Router();

// Retorna una instancia del Manager.
const getManager = (req) => {
    return req.app.get('cartManager');
}

router.get('/', async (req, res) => {
    const cartManager = getManager(req);

    try {
        const carts = await cartManager.getCart();
        res.json(carts);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false });
    }
});

// TODO: TERMINAR ADD PRODUCT TO CART.
router.post('/:cid/product/:pid', async (req, res) => {
    const cartManager = getManager(req);

    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    try {
        const cart = await cartManager.addProductCart(cid, { pid, quantity });
        res.json({ success: true, cart });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
})

module.exports = router;