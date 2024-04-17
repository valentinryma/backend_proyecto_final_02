const Router = require('express');
const router = Router();

// Retorna una instancia del Manager.
const getManager = (req) => {
    return req.app.get('cartManager');
}

// [GET]: Retorna todos los carritos
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

// [GET]: Retorna un carrito (find by id)
router.get('/:id', async (req, res) => {
    const cartManager = getManager(req);

    try {
        const cart = await cartManager.getCartById(req.params.id);
        res.json(cart);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: error.message });
    }
})

// [POST]: Retorna un nuevo carrito vacio (products = [])
router.post('/', async (req, res) => {
    const cartManager = getManager(req);

    try {
        const cart = await cartManager.addCart();
        res.json(cart);
    } catch (error) {
        console.error(error)
        return res.status(400).json({ success: false });
    }
})

// [POST]: Agrega un producto a un carrito existente.
router.post('/:cid/product/:pid', async (req, res) => {
    const cartManager = getManager(req);

    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    try {
        const cart = await cartManager.addProductCart(cid, { pid, quantity });
        if (cart.error) {
            res.status(404).json({ success: false, error: cart.error });
        }

        res.json({ success: true });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
})

// [DELETE]: Elimina un producto de un carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    const cartManager = getManager(req);
    const cid = req.params.cid;
    const pid = req.params.pid;

    console.log(cid, pid);

    try {
        const cart = await cartManager.deleteProductCart(cid, pid);

        if (cart.error) {
            res.status(404).json({ success: false, error: cart.error });
        }

        res.json({ success: true });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
})

// [PUT]: Actualiza un carrito con un array de productos (_id, quantity)
router.put('/:cid', async (req, res) => {
    const cartManager = getManager(req);
    const cid = req.params.cid;
    const productsArray = req.body;

    try {
        const cart = await cartManager.updateCartProductArray(cid, productsArray);
        res.json({ success: true });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
})

// [PUT]: Actualiza el Quantity de un producto en un carrito existente.
router.put('/:cid/carts/:pid', async (req, res) => {
    const cartManager = getManager(req);
    const cid = req.params.cid;

    const product = { pid: req.params.pid, quantity: req.body.quantity } // Producto actualizado.
    try {
        const cartUpdate = await cartManager.updateCartProductQuantity(cid, product)
        res.json({ success: true });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
})

// [DELETE] Limpia el Carrito (products = [])
router.delete('/:id', async (req, res) => {
    const cartManager = getManager(req);
    try {
        const cart = await cartManager.clearCart(req.params.id);
        res.json({ success: true });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
})

module.exports = router;
